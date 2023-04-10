from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .models import User, Department, Skill
from .views_shared import *


def not_a_manager(user):
    if hasattr(user, 'department'):
        raise ValidationError(f'User with id={user.id} is already manager of department id={user.department.id}')
    else:
        return user


class DepartmentSerializer(serializers.ModelSerializer):
    managerId = serializers.PrimaryKeyRelatedField(source='manager', required=False, allow_null=True,
                                                   queryset=User.objects.all(), validators=[not_a_manager],
                                                   help_text="ID руководителя отдела")

    class Meta:
        model = Department
        fields = ['id', 'name', 'managerId']


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


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


@method_decorator(name='list', decorator=swagger_auto_schema(
    tags=['Навык'],
    operation_summary='Все навыки',
    responses={
        403: forbidden_response
    }))
@method_decorator(name='create', decorator=swagger_auto_schema(
    tags=['Навык'],
    operation_summary='Создает новый навык',
    responses={
        400: validation_error_response,
        403: forbidden_response
    }))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(
    tags=['Навык'],
    operation_summary='Навык по его ID',
    responses={
        403: forbidden_response,
        404: not_found_response
    }))
@method_decorator(name='destroy', decorator=swagger_auto_schema(
    tags=['Навык'],
    operation_summary='Удаляет навык',
    responses={
        403: forbidden_response,
        404: not_found_response
    }))
class SkillView(ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    http_method_names = ['get', 'post', 'delete']

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        else:
            return [IsAdminUser()]
