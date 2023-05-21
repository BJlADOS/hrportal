from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.viewsets import ReadOnlyModelViewSet

from .shared import *
from ..models import Notification
from ..serializers import NotificationSerializer


@method_decorator(name='list', decorator=swagger_auto_schema(
    tags=['Уведомления'],
    operation_summary='Все уведомления пользователя',
    operation_description='Если не указывать параметры пагинации - будет возвращен не объект пагинации, а просто список объектов',
    paginator_inspectors=[FilterPaginatorInspector],
    responses={
        403: forbidden_response
    }
))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(
    tags=['Уведомления'],
    operation_summary='Уведомление пользователя по ID уведомления',
    responses={
        403: forbidden_response,
        404: not_found_response,
    }
))
class NotificationView(ReadOnlyModelViewSet):
    pagination_class = LimitOffsetPagination
    def get_queryset(self):
        return Notification.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return NotificationSerializer
        else:
            return None

    @swagger_auto_schema(
        tags=['Уведомления'],
        operation_summary='Отмечает уведомление как прочитанное',
        responses={
            403: forbidden_response,
            404: not_found_response,
        }
    )
    @action(methods=['patch'], detail=True, url_path='read', url_name='read')
    def set_read(self, request, pk):
        notification = self.get_object()
        notification.read = True
        notification.save()
        return Response(status=status.HTTP_200_OK)
