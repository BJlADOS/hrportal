from rest_framework import serializers

from ..models import User


class RegDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'fullname',
            'email',
            'password'
        ]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class AuthDataSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)


class CodeSerializer(serializers.Serializer):
    code = serializers.CharField(
        help_text='Уникальный код, прописанный в query-параметрах ссылки, отправленной на Email пользователя')


class PasswordRecoveryDataSerializer(serializers.Serializer):
    code = serializers.CharField(
        help_text='Уникальный код, прописанный в query-параметрах ссылки, отправленной на Email пользователя')
    password = serializers.CharField()
