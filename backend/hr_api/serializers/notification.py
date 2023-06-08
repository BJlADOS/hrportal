from rest_framework.serializers import ModelSerializer

from .shared import TimestampField
from ..models import Notification


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
