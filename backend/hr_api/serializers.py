from datetime import datetime

from django.conf import settings
from django.core.validators import FileExtensionValidator
from rest_framework import serializers
from rest_framework.serializers import ValidationError

from .models import *


def not_a_manager(user):
    if hasattr(user, 'department'):
        raise ValidationError(f'User with id={user.id} is already manager of department id={user.department.id}')
    else:
        return user


class DepartmentSerializer(serializers.ModelSerializer):
    managerId = serializers.PrimaryKeyRelatedField(source='manager',
                                                   queryset=User.objects.all(),
                                                   required=False,
                                                   allow_null=True,
                                                   validators=[not_a_manager])

    class Meta:
        model = Department
        fields = ['id', 'name', 'managerId']


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class TimestampField(serializers.Field):
    def to_internal_value(self, timestamp):
        return datetime.fromtimestamp(timestamp / 1000)

    def to_representation(self, date):
        return int(date.timestamp()) * 1000


def validate_filesize(max_filesize):
    def return_function(value):
        if value.size > max_filesize:
            raise ValidationError(f"You cannot upload file more than {max_filesize} bytes")
        else:
            return value

    return return_function


class GetPostResumeSerializer(serializers.ModelSerializer):
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


class PatchResumeSerializer(serializers.ModelSerializer):
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


class GetVacancySerializer(serializers.ModelSerializer):
    department = DepartmentSerializer()
    status = serializers.ChoiceField(choices=API_STATUS_CHOICES)
    requiredSkills = SkillSerializer(source='required_skills', many=True)
    modifiedAt = TimestampField(source='modified_at', required=False)
    createdAt = TimestampField(source='created_at', required=False)

    class Meta:
        model = Vacancy
        fields = [
            'id',
            'department',
            'position',
            'salary',
            'employment',
            'schedule',
            'description',
            'requiredSkills',
            'status',
            'modifiedAt',
            'createdAt'
        ]


class PostVacancySerializer(serializers.ModelSerializer):
    requiredSkillsIds = serializers.PrimaryKeyRelatedField(source='required_skills', queryset=Skill.objects.all(),
                                                           many=True)
    status = serializers.ChoiceField(choices=API_STATUS_CHOICES, required=False)
    description = serializers.CharField(required=False)

    class Meta:
        model = Vacancy
        fields = [
            'position',
            'salary',
            'employment',
            'schedule',
            'description',
            'requiredSkillsIds',
            'status'
        ]


class PatchVacancySerializer(serializers.ModelSerializer):
    position = serializers.CharField(required=False)
    salary = serializers.IntegerField(required=False)
    employment = serializers.ChoiceField(choices=EMPLOYMENT_CHOICES, required=False)
    schedule = serializers.ChoiceField(choices=SCHEDULE_CHOICES, required=False)
    description = serializers.CharField(required=False)
    status = serializers.ChoiceField(choices=API_STATUS_CHOICES)
    requiredSkillsIds = serializers.PrimaryKeyRelatedField(source='required_skills', queryset=Skill.objects.all(),
                                                           many=True, required=False)

    class Meta:
        model = Vacancy
        fields = [
            'position',
            'salary',
            'employment',
            'schedule',
            'description',
            'requiredSkillsIds',
            'status'
        ]


class VacancyResponseSerializer(serializers.Serializer):
    resume = serializers.FileField(validators=[FileExtensionValidator(['pdf']),
                                               validate_filesize(settings.MAX_EMAIL_ATTACHMENT_SIZE)])

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass
