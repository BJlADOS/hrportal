from rest_framework import serializers

from .activity import ActivitySerializer, ActivityPatchDataSerializer
from .shared import TimestampField
from ..models import Grade, User, Activity


class GradeSerializer(serializers.ModelSerializer):
    employeeId = serializers.PrimaryKeyRelatedField(source='employee', read_only=True)
    inWork = serializers.BooleanField(source='in_work')
    expirationDate = TimestampField(source='expiration_date')
    activities = ActivitySerializer(source='activity_set', many=True)

    class Meta:
        model = Grade
        fields = ['id', 'employeeId', 'name', 'inWork', 'expirationDate', 'activities']


class GradePostDataSerializer(serializers.ModelSerializer):
    employeeId = serializers.PrimaryKeyRelatedField(source='employee', queryset=User.objects.all())
    expirationDate = TimestampField(source='expiration_date')
    activities = ActivityPatchDataSerializer(many=True)

    class Meta:
        model = Grade
        fields = ['name', 'employeeId', 'expirationDate', 'activities']

    def create(self, validated_data):
        activities_data = validated_data.pop('activities')
        grade = Grade.objects.create(**validated_data)
        for activity_data in activities_data:
            Activity.objects.create(grade=grade, **activity_data)
        return grade

    def to_representation(self, instance):
        return GradeSerializer(instance).data


class GradePatchDataSerializer(serializers.ModelSerializer):
    expirationDate = TimestampField(source='expiration_date')

    class Meta:
        model = Grade
        fields = ['name', 'expirationDate']

    def to_representation(self, instance):
        return GradeSerializer(instance).data
