from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAdminUser
from rest_framework.viewsets import ModelViewSet

from .shared import forbidden_response, not_found_response
from ..models import Activity
from ..permissions import IsEmployeeOwner, IsManagerUser
from ..serializers import ActivitySerializer, ActivityPatchDataSerializer, ActivityPostDataSerializer


@method_decorator(name='list', decorator=swagger_auto_schema(
    tags=['Активности'],
    operation_summary='Все активности',
    responses={
        403: forbidden_response
    }
))
@method_decorator(name='create', decorator=swagger_auto_schema(
    tags=['Активности'],
    operation_summary='Создает активность',
    responses={
        200: ActivitySerializer,
        403: forbidden_response
    }
))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(
    tags=['Активности'],
    operation_summary='Активность по ID',
    responses={
        403: forbidden_response,
        404: not_found_response
    }
))
@method_decorator(name='partial_update', decorator=swagger_auto_schema(
    tags=['Активности'],
    operation_summary='Изменить активность по ID',
    responses={
        200: ActivitySerializer,
        403: forbidden_response,
        404: not_found_response,
    }
))
@method_decorator(name='destroy', decorator=swagger_auto_schema(
    tags=['Активности'],
    operation_summary='Удалить активность по ID',
    responses={
        403: forbidden_response,
        404: not_found_response,
    }
))
class ActivityView(ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ActivitySerializer
        if self.action == 'create':
            return ActivityPostDataSerializer
        if self.action == 'partial_update':
            return ActivityPatchDataSerializer
        else:
            return None

    def get_permissions(self):
        if self.request.method == 'GET':
            return [(IsEmployeeOwner | IsManagerUser | IsAdminUser)()]
        else:
            return [(IsManagerUser | IsAdminUser)()]
