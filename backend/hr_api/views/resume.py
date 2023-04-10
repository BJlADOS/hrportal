from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema, no_body
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet

from .shared import *
from ..email import send_resume_response
from ..filters import ResumeFilter
from ..permissions import IsManagerUser
from ..serializers.resume import *


@method_decorator(name='list', decorator=swagger_auto_schema(
    tags=['Резюме'],
    operation_summary='Все резюме (фильтрация, сортировка, пагинация)',
    filter_inspectors=[VacancyResumeFilterInspector],
    paginator_inspectors=[VacancyResumeFilterInspector],
    manual_parameters=VacancyResumeFilterInspector.min_max_salary_parameters,
    responses={
        403: forbidden_response,
    }))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(
    tags=['Резюме'],
    operation_summary='Резюме по его ID',
    responses={
        403: forbidden_response,
        404: not_found_response
    }))
class ResumeView(ReadOnlyModelViewSet):
    permission_classes = [IsManagerUser | IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['$desired_position']
    filterset_class = ResumeFilter
    pagination_class = LimitOffsetPagination
    serializer_class = ResumeSerializer

    def get_queryset(self):
        if self.request.user.is_admin:
            return Resume.objects.all()
        elif self.request.user.is_manager:
            return Resume.objects.filter(status='PUBLIC')
        else:
            return Resume.objects.none()

    @swagger_auto_schema(
        tags=['Резюме'],
        request_body=no_body,
        operation_summary='Отправляет сотруднику на email отклик на его резюме',
        responses={
            200: openapi.Response('Запрос выполнен', detail_schema),
            403: forbidden_response,
            404: not_found_response
        })
    @action(methods=['post'], detail=True, url_path='response', url_name='response')
    def email_response(self, request, pk):
        resume = get_object_or_404(Resume, id=pk)
        result = send_resume_response(resume, request.user)
        return response_with_detail(result, status.HTTP_200_OK)


class UserResumeView(APIView):
    def get_parsers(self):
        if 'docs' in self.request.path and self.request.method in ['POST', 'PATCH']:
            return [MultiPartParser]
        else:
            return super().get_parsers()

    @swagger_auto_schema(
        tags=['Резюме'],
        operation_summary='Резюме авторизованного сотрудника',
        responses={
            200: ResumeSerializer(),
            403: forbidden_response,
            404: not_found_response
        }
    )
    def get(self, request):
        resumes = Resume.objects.filter(employee=request.user).exclude(status="DELETED")
        if len(resumes) > 0:
            serializer = ResumeSerializer(resumes.first())
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return response_with_detail("This employee doesn't have a resume", status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        tags=['Резюме'],
        operation_summary='Создает резюме для авторизованного сотрудника',
        request_body=ResumePatchDataSerializer,
        responses={
            200: ResumeSerializer(),
            400: validation_error_response,
            403: forbidden_response,
            409: openapi.Response(
                'У сотрудника уже есть резюме',
                detail_schema)
        })
    def post(self, request):
        resumes = Resume.objects.filter(employee=request.user).exclude(status="DELETED")
        if len(resumes) > 0:
            return response_with_detail('This employee already has a resume', status.HTTP_409_CONFLICT)
        else:
            data = request.data.dict()
            data['employeeId'] = request.user.id
            serializer = ResumeSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        tags=['Резюме'],
        operation_summary='Изменяет резюме авторизованного сотрудника',
        request_body=ResumePatchDataSerializer,
        responses={
            200: ResumeSerializer(),
            400: validation_error_response,
            403: forbidden_response,
            404: not_found_response
        }
    )
    def patch(self, request):
        resumes = Resume.objects.filter(employee=request.user).exclude(status="DELETED")
        if len(resumes) > 0:
            resume = resumes.first()
            patch_serializer = ResumePatchDataSerializer(resume, data=request.data)
            patch_serializer.is_valid(raise_exception=True)
            patch_serializer.save()
            serializer = ResumeSerializer(resume)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return response_with_detail("This employee doesn't have a resume", status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        tags=['Резюме'],
        operation_summary='Удаляет резюме авторизованного сотрудника',
        responses={
            403: forbidden_response,
            404: not_found_response
        })
    def delete(self, request):
        resumes = Resume.objects.filter(employee=request.user).exclude(status="DELETED")
        if len(resumes) > 0:
            resume = resumes.first()
            resume.status = "DELETED"
            resume.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return response_with_detail("This employee doesn't have a resume", status.HTTP_404_NOT_FOUND)
