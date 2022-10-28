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
    managerId = serializers.IntegerField(source='manager_id')

    class Meta:
        model = Department
        fields = ['id', 'name', 'managerId']


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    currentDepartment = DepartmentSerializer(source='current_department')
    existingSkills = SkillSerializer(source='existing_skills', many=True)
    isManager = serializers.BooleanField(source='is_manager')
    isAdmin = serializers.BooleanField(source='is_admin')

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
            'isManager',
            'isAdmin'
        ]
