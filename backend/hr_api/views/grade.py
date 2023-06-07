from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework.viewsets import ModelViewSet

from .shared import forbidden_response, not_found_response
from ..models import Grade
from ..serializers import GradeSerializer, GradePostDataSerializer


@method_decorator(name='list', decorator=swagger_auto_schema(
    tags=['Грейды'],
    operation_summary='Все грейды',
    responses={
        403: forbidden_response
    }
))
@method_decorator(name='create', decorator=swagger_auto_schema(
    tags=['Грейды'],
    operation_summary='Создает грейд',
    responses={
        200: GradeSerializer,
        403: forbidden_response,
        404: not_found_response,
    }
))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(
    tags=['Грейды'],
    operation_summary='Грейд по ID',
    responses={
        403: forbidden_response,
        404: not_found_response,
    }
))
class GradeView(ModelViewSet):
    queryset = Grade.objects.all()
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return GradeSerializer
        elif self.action == 'create':
            return GradePostDataSerializer
        else:
            return GradeSerializer
