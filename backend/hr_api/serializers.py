from datetime import datetime

from django.conf import settings
from django.core.validators import FileExtensionValidator
from rest_framework import serializers
from rest_framework.serializers import ValidationError

from .models import *


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'fullname',
            'email',
            'password'
        ]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class CodeSerializer(serializers.Serializer):
    code = serializers.CharField()

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class RecoverySerializer(serializers.Serializer):
    code = serializers.CharField()
    password = serializers.CharField()

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class AuthSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


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


class GetUserSerializer(serializers.ModelSerializer):
    currentDepartment = DepartmentSerializer(source='current_department')
    existingSkills = SkillSerializer(source='existing_skills', many=True)
    isManager = serializers.BooleanField(source='is_manager')
    isAdmin = serializers.BooleanField(source='is_admin')
    emailVerified = serializers.BooleanField(source='email_verified')
    resumeId = serializers.PrimaryKeyRelatedField(source='resume', read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'fullname',
            'email',
            'contact',
            'experience',
            'currentDepartment',
            'photo',
            'existingSkills',
            'filled',
            'resumeId',
            'isManager',
            'isAdmin',
            'emailVerified'
        ]


class PatchUserSerializer(serializers.ModelSerializer):
    fullname = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    contact = serializers.CharField(required=False, allow_null=True)
    experience = serializers.ChoiceField(required=False, choices=User.EXPERIENCE_CHOICES, allow_null=True)
    photo = serializers.ImageField(required=False, allow_null=True)
    currentDepartmentId = serializers.PrimaryKeyRelatedField(required=False, queryset=Department.objects.all(),
                                                             source='current_department', allow_null=True)
    existingSkillsIds = serializers.PrimaryKeyRelatedField(required=False, queryset=Skill.objects.all(), many=True,
                                                           source='existing_skills')

    def validate(self, attrs):
        if self.instance.is_manager and \
                'current_department' in attrs and \
                self.instance.department != attrs['current_department']:
            raise ValidationError(
                {'currentDepartmentId': f'User is manager of department {self.instance.department}'
                                        f' and therefore cannot be in another department'})
        return super(PatchUserSerializer, self).validate(attrs)

    class Meta:
        model = User
        fields = [
            'fullname',
            'email',
            'contact',
            'experience',
            'photo',
            'currentDepartmentId',
            'existingSkillsIds'
        ]


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


class GetResumeSerializer(serializers.ModelSerializer):
    employeeId = serializers.PrimaryKeyRelatedField(source='employee', queryset=User.objects.all())
    desiredPosition = serializers.CharField(source='desired_position')
    desiredSalary = serializers.IntegerField(source='desired_salary')
    desiredEmployment = serializers.ChoiceField(source='desired_employment', choices=EMPLOYMENT_CHOICES)
    desiredSchedule = serializers.ChoiceField(source='desired_schedule', choices=SCHEDULE_CHOICES)
    isActive = serializers.BooleanField(source='is_active')
    resume = serializers.FileField(validators=[FileExtensionValidator(['pdf']),
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
            'isActive',
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
    isActive = serializers.BooleanField(source='is_active', required=False, allow_null=True)

    class Meta:
        model = Resume
        fields = [
            'desiredPosition',
            'desiredSalary',
            'desiredEmployment',
            'desiredSchedule',
            'resume',
            'isActive'
        ]


class GetVacancySerializer(serializers.ModelSerializer):
    department = DepartmentSerializer()
    requiredSkills = SkillSerializer(source='required_skills', many=True)
    isActive = serializers.BooleanField(source='is_active')
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
            'isActive',
            'modifiedAt',
            'createdAt'
        ]


class PostVacancySerializer(serializers.ModelSerializer):
    isActive = serializers.BooleanField(source='is_active')
    requiredSkillsIds = serializers.PrimaryKeyRelatedField(source='required_skills', queryset=Skill.objects.all(),
                                                           many=True)
    description = serializers.CharField()

    class Meta:
        model = Vacancy
        fields = [
            'position',
            'salary',
            'employment',
            'schedule',
            'description',
            'requiredSkillsIds',
            'isActive'
        ]


class PatchVacancySerializer(serializers.ModelSerializer):
    position = serializers.CharField(required=False)
    salary = serializers.IntegerField(required=False)
    employment = serializers.ChoiceField(choices=EMPLOYMENT_CHOICES, required=False)
    schedule = serializers.ChoiceField(choices=SCHEDULE_CHOICES, required=False)
    description = serializers.CharField(required=False)
    requiredSkillsIds = serializers.PrimaryKeyRelatedField(source='required_skills', queryset=Skill.objects.all(),
                                                           many=True, required=False)
    isActive = serializers.BooleanField(source='is_active', required=False)

    class Meta:
        model = Vacancy
        fields = [
            'position',
            'salary',
            'employment',
            'schedule',
            'description',
            'requiredSkillsIds',
            'isActive'
        ]


class VacancyResponseSerializer(serializers.Serializer):
    resume = serializers.FileField(validators=[FileExtensionValidator(['pdf']),
                                               validate_filesize(settings.MAX_EMAIL_ATTACHMENT_SIZE)])

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass
