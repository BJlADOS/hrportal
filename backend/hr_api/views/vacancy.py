from django.utils.decorators import method_decorator
from django_filters.rest_framework import DjangoFilterBackend
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
from ..models import get_upload_path
from ..permissions import IsManagerUser
from ..serializers.vacancy import *


@method_decorator(name='list', decorator=swagger_auto_schema(
    tags=['Вакансия'],
    operation_summary='Список вакансий (фильтрация, сортировка, пагинация)',
    operation_description='Если не указывать параметры пагинации - будет возвращен не объект пагинации, а просто список объектов',
    filter_inspectors=[FilterPaginatorInspector],
    paginator_inspectors=[FilterPaginatorInspector],
    manual_parameters=FilterPaginatorInspector.min_max_salary_parameters,
    responses={
        400: validation_error_response,
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
        if self.action in ['list', 'retrieve', 'response']:
            return [IsAuthenticated()]
        elif self.action == 'create':
            return [IsManagerUser()]
        elif self.action in ['final_destroy']:
            return [IsAdminUser()]
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
        if hasattr(self, 'action') and self.action == 'response':
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
            403: forbidden_response,
            404: not_found_response
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
        operation_summary='Мягкое удаление вакансии',
        responses={
            403: forbidden_response,
            404: not_found_response
        })
    def destroy(self, request, *args, **kwargs):
        vacancy = self.get_object()
        vacancy.soft_delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @swagger_auto_schema(
        tags=['Вакансия'],
        operation_summary='Окончательное удаление вакансии',
        responses={
            403: forbidden_response,
            404: not_found_response,
        }
    )
    @action(methods=['delete'], detail=True, url_path='final', url_name='final-delete')
    def final_destroy(self, request, *args, **kwargs):
        vacancy = self.get_object()
        self.perform_destroy(vacancy)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @swagger_auto_schema(
        tags=['Вакансия'],
        operation_summary='Отправляет руководителю на email отклик на вакансию его департамента',
        request_body=VacancyResponseDataSerializer,
        responses={
            200: openapi.Response('Запрос выполнен', detail_schema),
            400: validation_error_response,
            403: forbidden_response,
            404: not_found_response
        })
    @action(methods=['post'], detail=True, url_path='response', url_name='response')
    def response(self, request, pk):
        vacancy = self.get_object()

        manager = vacancy.department.manager
        if manager is None:
            return response_with_detail('Vacancy department does not have manager', status.HTTP_404_NOT_FOUND)

        uploaded_file = request.data.get('resume', None)
        if uploaded_file is not None:
            pdf_resume = PDFResume(employee=request.user, file=uploaded_file)
            pdf_resume.save()
        else:
            resumes = Resume.objects.filter(employee=request.user).exclude(status='DELETED')
            if len(resumes) > 0:
                pdf_resume = resumes.first()
            else:
                return response_with_detail('Employee does not have resume', status.HTTP_400_BAD_REQUEST)

        Notification.vacancy_response(vacancy, manager, request.user, pdf_resume)
        result = send_vacancy_response(request.user, manager, vacancy, pdf_resume)
        return response_with_detail(result, status.HTTP_200_OK)
