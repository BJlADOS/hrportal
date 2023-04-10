from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.viewsets import ModelViewSet

from .shared import *
from ..models import Skill
from ..serializers import SkillSerializer


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
