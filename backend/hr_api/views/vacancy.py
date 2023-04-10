from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.inspectors import CoreAPICompatInspector
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .shared import *
from ..email import send_vacancy_response
from ..filters import *
from ..permissions import IsManagerUser
from ..serializers.vacancy import *


class VacancyInfoInspector(CoreAPICompatInspector):
    def get_paginator_parameters(self, paginator):
        result = super(VacancyInfoInspector, self).get_paginator_parameters(paginator)
        for param in result:
            match param.name:
                case 'limit':
                    param.description = 'Количество результатов, возвращаемых на страницу'
                case 'offset':
                    param.description = 'Индекс, начиная с которого возвращаются результаты'

        return result

    def get_filter_parameters(self, filter_backend):
        result = super(VacancyInfoInspector, self).get_filter_parameters(filter_backend)
        for param in result:
            match param.name:
                case 'employment':
                    param.description = 'Занятость'
                    param.enum = ['PART', 'FULL']
                case 'schedule':
                    param.description = 'График'
                    param.enum = ['DISTANT', 'FLEX', 'SHIFT', 'FULL']
                case 'ordering':
                    param.description = 'Сортировка (по зарплате, по времени последнего изменения)'
                    param.enum = ['salary', '-salary', 'time', '-time']
                case 'status':
                    param.description = 'Статус вакансии'
                    param.enum = ['PUBLIC', 'ARCHIVED', 'DELETED']
                case 'skills':
                    param.description = 'Список ID требуемых навыков'
                    param.type = openapi.TYPE_ARRAY
                case 'department':
                    param.description = 'Список ID отделов'
                    param.type = openapi.TYPE_ARRAY
                case 'search':
                    param.description = 'Поиск по названию должности'

        return [p for p in result if not 'salary' in p.name]


@method_decorator(name='list', decorator=swagger_auto_schema(
    tags=['Вакансия'],
    operation_summary='Список вакансий (фильтрация, сортировка, пагинация)',
    filter_inspectors=[VacancyInfoInspector],
    paginator_inspectors=[VacancyInfoInspector],
    manual_parameters=[
        openapi.Parameter(name='salary_min', in_=openapi.IN_QUERY,
                          description='Минимальная зарплата', required=False,
                          type=openapi.TYPE_INTEGER),
        openapi.Parameter(name='salary_max', in_=openapi.IN_QUERY,
                          description='Максимальная зарплата', required=False,
                          type=openapi.TYPE_INTEGER)
    ],
    responses={
        403: forbidden_response
    }))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(
    tags=['Вакансия'],
    operation_summary='Вакансия по ее ID',
    responses={
        403: forbidden_response,
        404: not_found_response
    }))
class VacancyView(ModelViewSet):
    http_method_names = ["get", "post", "patch", "delete"]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['$position']
    filterset_class = VacancyFilter
    pagination_class = LimitOffsetPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'email_response']:
            return [IsAuthenticated()]
        elif self.action == 'create':
            return [IsManagerUser()]
        else:
            return [(IsManagerUser | IsAdminUser)()]

    def get_queryset(self):
        user = self.request.user
        base = Vacancy.objects
        if user.is_admin:
            return base.all()
        elif user.is_manager:
            return base.filter(status='PUBLIC') | base.filter(department=user.department, status='ARCHIVED')
        else:
            return base.filter(status='PUBLIC')

    def get_parsers(self):
        if hasattr(self, 'action') and self.action == 'email_response':
            return [MultiPartParser]
        else:
            return super().get_parsers()

    def get_serializer_class(self):
        if self.action == 'create':
            return VacancyPostDataSerializer
        elif self.action == 'partial_update':
            return VacancyPatchDataSerializer
        else:
            return VacancySerializer

    @swagger_auto_schema(
        tags=['Вакансия'],
        operation_summary='Создает новую вакансию',
        responses={
            200: VacancySerializer,
            400: validation_error_response,
            403: forbidden_response
        })
    def create(self, request, *args, **kwargs):
        post_serializer = VacancyPostDataSerializer(data=request.data)
        post_serializer.is_valid(raise_exception=True)
        vacancy = post_serializer.save(department=request.user.department)
        return Response(VacancySerializer(vacancy).data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        tags=['Вакансия'],
        operation_summary='Изменяет вакансию',
        responses={
            200: VacancySerializer,
            400: validation_error_response,
            403: forbidden_response
        })
    def partial_update(self, request, *args, **kwargs):
        result = super(VacancyView, self).partial_update(request, args, kwargs)
        if result.status_code == 200:
            vacancy = Vacancy.objects.get(id=kwargs['pk'])
            data = VacancySerializer(vacancy).data
            return Response(data, status=status.HTTP_200_OK)
        return result

    @swagger_auto_schema(
        tags=['Вакансия'],
        operation_summary='Удаляет вакансию',
        responses={
            403: forbidden_response
        })
    def destroy(self, request, *args, **kwargs):
        vacancy = self.get_object()
        vacancy.status = 'DELETED'
        vacancy.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @swagger_auto_schema(
        tags=['Вакансия'],
        operation_summary='Удаляет вакансию',
        request_body=VacancyResponseDataSerializer,
        responses={
            200: openapi.Response('Запрос выполнен', detail_schema),
            400: validation_error_response,
            403: forbidden_response,
            404: not_found_response
        })
    @action(methods=['post'], detail=True, url_path='response', url_name='response')
    def email_response(self, request, pk):
        vacancy = get_object_or_404(Vacancy, id=pk)

        manager = vacancy.department.manager
        if manager is None:
            return response_with_detail('Vacancy department does not have manager', status.HTTP_404_NOT_FOUND)

        resume = request.data.get('resume', None)
        if resume is None:
            resumes = Resume.objects.filter(employee=request.user).exclude(status='DELETED')
            if len(resumes) > 0:
                resume = resumes.first().resume
            else:
                return response_with_detail('Employee does not have resume', status.HTTP_400_BAD_REQUEST)

        serializer = VacancyResponseDataSerializer(data={'resume': resume})
        serializer.is_valid(raise_exception=True)
        result = send_vacancy_response(request.user, manager, vacancy, resume)
        return response_with_detail(result, status.HTTP_200_OK)
