from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework.viewsets import ReadOnlyModelViewSet

from .shared import *
from ..models import Notification
from ..serializers import NotificationSerializer


@method_decorator(name='list', decorator=swagger_auto_schema(
    tags=['Уведомления'],
    operation_summary='Все уведомления пользователя',
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
    def get_queryset(self):
        return Notification.objects.filter(owner=self.request.user)

    serializer_class = NotificationSerializer
