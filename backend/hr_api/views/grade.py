from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema, no_body
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .shared import forbidden_response, not_found_response
from ..models import Grade
from ..serializers import GradeSerializer, GradePostDataSerializer, GradePatchDataSerializer


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
        403: forbidden_response
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
@method_decorator(name='partial_update', decorator=swagger_auto_schema(
    tags=['Грейды'],
    operation_summary='Изменить грейд по ID',
    responses={
        200: GradeSerializer,
        403: forbidden_response,
        404: not_found_response,
    }
))
@method_decorator(name='destroy', decorator=swagger_auto_schema(
    tags=['Грейды'],
    operation_summary='Удалить грейд по ID',
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
        elif self.action == 'partial_update':
            return GradePatchDataSerializer
        else:
            return GradeSerializer

    @swagger_auto_schema(
        tags=['Грейды'],
        request_body=no_body,
        operation_summary='Завершает грейд (inWork = false)',
        responses={
            200: 'OK',
            403: forbidden_response,
            404: not_found_response
        })
    @action(methods=['patch'], detail=True, url_path='complete', url_name='complete')
    def complete(self, request, pk):
        resume = get_object_or_404(Grade, id=pk)
        resume.complete()
        return Response(status=status.HTTP_200_OK)
