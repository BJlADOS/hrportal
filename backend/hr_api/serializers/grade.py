from rest_framework import serializers

from .activity import ActivitySerializer
from .shared import TimestampField
from ..models import Grade, User


class GradeSerializer(serializers.ModelSerializer):
    employeeId = serializers.PrimaryKeyRelatedField(source='employee', queryset=User.objects.all())
    inWork = serializers.BooleanField(source='in_work')
    expirationDate = TimestampField(source='expiration_date')
    activities = ActivitySerializer(source='activity_set', many=True)

    class Meta:
        model = Grade
        fields = ['id', 'employeeId', 'name', 'inWork', 'expirationDate', 'activities']
