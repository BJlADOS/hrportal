from django.core import validators
from rest_framework import serializers

from .models import User


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
