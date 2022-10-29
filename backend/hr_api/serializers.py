from datetime import datetime

from rest_framework import serializers

from .models import *


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('fullname', 'email', 'password')

    password = serializers.CharField(
        required=True,
        min_length=6,
        max_length=20,
        validators=[
            validators.RegexValidator(
                regex='^[a-zA-Z]*$',
                message='Field can only contain the characters a-z and A-Z',
                code='invalid_password'
            ),
        ])

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class AuthSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(max_length=128)

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class UniqueEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass


class DepartmentSerializer(serializers.ModelSerializer):
    managerId = serializers.IntegerField(source='manager_id', required=False)

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
            'isAdmin'
        ]


class PutUserSerializer(serializers.ModelSerializer):
    fullname = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    contact = serializers.CharField(required=False, allow_null=True)
    experience = serializers.ChoiceField(required=False, choices=User.EXPERIENCE_CHOICES, allow_null=True)
    photo = serializers.ImageField(required=False, allow_null=True)
    currentDepartmentId = serializers.PrimaryKeyRelatedField(required=False, queryset=Department.objects.all(),
                                                             source='current_department', allow_null=True)
    existingSkillsIds = serializers.PrimaryKeyRelatedField(required=False, queryset=Skill.objects.all(), many=True,
                                                           source='existing_skills')

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

    def update(self, instance, validated_data):
        if 'existingSkillsIds' not in self.initial_data and 'existing_skills' in validated_data:
            del validated_data['existing_skills']
        return super(PutUserSerializer, self).update(instance, validated_data)


class TimestampField(serializers.Field):
    def to_internal_value(self, data):
        return datetime.fromtimestamp(data)

    def to_representation(self, value):
        return int(value.timestamp())


class ResumeSerializer(serializers.ModelSerializer):
    employeeId = serializers.PrimaryKeyRelatedField(source='employee', read_only=True)
    desiredPosition = serializers.CharField(source='desired_position')
    desiredSalary = serializers.IntegerField(source='desired_salary')
    desiredEmployment = serializers.CharField(source='desired_employment')
    desiredSchedule = serializers.CharField(source='desired_schedule')
    isActive = serializers.BooleanField(source='is_active')
    modifiedAt = TimestampField(source='modified_at')
    createdAt = TimestampField(source='created_at')

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
