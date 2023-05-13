from rest_framework.serializers import ModelSerializer

from ..models import Notification
from .shared import TimestampField


class NotificationSerializer(ModelSerializer):
    notifyTime = TimestampField(source='notify_time')
    class Meta:
        model = Notification
        fields = [
            'id',
            'owner',
            'type',
            'value',
            'read',
            'notifyTime'
        ]
