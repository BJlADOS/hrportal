from django.conf import settings
from django.core.validators import FileExtensionValidator
from rest_framework import serializers

from .shared import *
from ..models import *


class ResumeSerializer(serializers.ModelSerializer):
    employeeId = serializers.PrimaryKeyRelatedField(source='employee', queryset=User.objects.all())
    status = serializers.ChoiceField(choices=API_STATUS_CHOICES, required=False)
    desiredPosition = serializers.CharField(source='desired_position')
    desiredSalary = serializers.IntegerField(source='desired_salary')
    desiredEmployment = serializers.ChoiceField(source='desired_employment', choices=EMPLOYMENT_CHOICES)
    desiredSchedule = serializers.ChoiceField(source='desired_schedule', choices=SCHEDULE_CHOICES)
    resume = serializers.FileField(use_url=False, validators=[FileExtensionValidator(['pdf']),
                                                              validate_filesize(settings.MAX_EMAIL_ATTACHMENT_SIZE)])
    modifiedAt = TimestampField(source='modified_at', required=False)
    createdAt = TimestampField(source='created_at', required=False)

    class Meta:
        model = Resume
        fields = [
            'id',
            'employeeId',
            'desiredPosition',
            'desiredSalary',
            'desiredEmployment',
            'desiredSchedule',
            'resume',
            'status',
            'modifiedAt',
            'createdAt'
        ]


class ResumePatchDataSerializer(serializers.ModelSerializer):
    desiredPosition = serializers.CharField(source='desired_position', required=False)
    desiredSalary = serializers.IntegerField(source='desired_salary', required=False)
    desiredEmployment = serializers.ChoiceField(source='desired_employment', choices=EMPLOYMENT_CHOICES, required=False)
    desiredSchedule = serializers.ChoiceField(source='desired_schedule', choices=SCHEDULE_CHOICES, required=False)
    resume = serializers.FileField(required=False, allow_null=True,
                                   validators=[FileExtensionValidator(['pdf']),
                                               validate_filesize(settings.MAX_EMAIL_ATTACHMENT_SIZE)])
    status = serializers.ChoiceField(choices=API_STATUS_CHOICES, required=False)

    class Meta:
        model = Resume
        fields = [
            'desiredPosition',
            'desiredSalary',
            'desiredEmployment',
            'desiredSchedule',
            'resume',
            'status'
        ]
