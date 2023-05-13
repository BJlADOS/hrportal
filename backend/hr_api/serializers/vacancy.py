from django.conf import settings
from django.core.validators import FileExtensionValidator
from rest_framework import serializers

from .department import DepartmentSerializer
from .shared import *
from .skill import SkillSerializer
from ..models import *


class VacancySerializer(serializers.ModelSerializer):
    department = DepartmentSerializer()
    status = serializers.ChoiceField(choices=STATUS_CHOICES)
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


class VacancyPostDataSerializer(serializers.ModelSerializer):
    requiredSkillsIds = serializers.PrimaryKeyRelatedField(source='required_skills', queryset=Skill.objects.all(),
                                                           many=True)
    status = serializers.ChoiceField(choices=STATUS_CHOICES, required=False)
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


class VacancyPatchDataSerializer(serializers.ModelSerializer):
    position = serializers.CharField(required=False)
    salary = serializers.IntegerField(required=False)
    employment = serializers.ChoiceField(choices=EMPLOYMENT_CHOICES, required=False)
    schedule = serializers.ChoiceField(choices=SCHEDULE_CHOICES, required=False)
    description = serializers.CharField(required=False)
    status = serializers.ChoiceField(choices=STATUS_CHOICES)
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


class VacancyResponseDataSerializer(serializers.Serializer):
    resume = serializers.FileField(validators=[FileExtensionValidator(['pdf']),
                                               validate_filesize(settings.MAX_EMAIL_ATTACHMENT_SIZE)],
                                   required=False)
