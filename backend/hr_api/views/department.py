from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .shared import *
from ..models import Department
from ..serializers import DepartmentSerializer


@method_decorator(name='list', decorator=swagger_auto_schema(
    tags=['Отдел'],
    operation_summary='Все отделы',
    responses={
        403: forbidden_response
    }))
@method_decorator(name='create', decorator=swagger_auto_schema(
    tags=['Отдел'],
    operation_summary='Создает новый отдел',
    responses={
        400: validation_error_response,
        403: forbidden_response
    }))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(
    tags=['Отдел'],
    operation_summary='Отдел по его ID',
    responses={
        403: forbidden_response,
        404: not_found_response
    }))
@method_decorator(name='partial_update', decorator=swagger_auto_schema(
    tags=['Отдел'],
    operation_summary='Изменяет отдел',
    responses={
        400: validation_error_response,
        403: forbidden_response,
        404: not_found_response
    }))
@method_decorator(name='destroy', decorator=swagger_auto_schema(
    tags=['Отдел'],
    operation_summary='Удаляет отдел',
    responses={
        403: forbidden_response,
        404: not_found_response
    }))
class DepartmentView(ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        else:
            return [IsAdminUser()]
