from django.contrib.auth import authenticate
from django.shortcuts import redirect
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import authentication_classes, permission_classes, action
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import GenericViewSet

from .shared import *
from ..authentication import *
from ..email import send_verification_email, send_password_recovery_email
from ..serializers.reg_and_auth import *


@authentication_classes([])
@permission_classes([AllowAny])
class RegistrationView(GenericViewSet):
    @swagger_auto_schema(tags=['Регистрация'],
                         operation_summary="Регистрирует пользователя",
                         operation_description="Также отправляет на Email письмо с ссылкой для подтверждения адреса электронной почты",
                         request_body=RegDataSerializer,
                         responses={
                             201: openapi.Response(
                                 "Пользователь зарегистрирован",
                                 detail_schema),
                             400: validation_error_response
                         })
    @action(methods=['post'], detail=False, url_path='reg', url_name='register')
    def register(self, request):
        serializer = RegDataSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        result = send_verification_email(user)

        return response_with_detail(result, status.HTTP_201_CREATED)

    @swagger_auto_schema(tags=['Регистрация'],
                         operation_summary='Проверяет email на уникальность',
                         request_body=EmailSerializer,
                         responses={
                             200: openapi.Response(
                                 'Email проверен (результаты)',
                                 openapi.Schema(type='object', properties={
                                     'unique': openapi.Schema(type='boolean')
                                 })),
                             400: validation_error_response
                         })
    @action(methods=['post'], detail=False, url_path='unique-email', url_name='unique-email')
    def unique_email(self, request):
        serializer = EmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = True
        try:
            User.objects.get(email=serializer.data['email'])
            result = False
        except User.DoesNotExist:
            pass
        return Response({'unique': result}, status=status.HTTP_200_OK)


@authentication_classes([])
@permission_classes([AllowAny])
class AuthenticationView(GenericViewSet):
    @swagger_auto_schema(tags=['Аутентификация'],
                         operation_summary='Аутентифицирует пользователя',
                         request_body=AuthDataSerializer,
                         responses={
                             200: "Пользователь аутентифицирован",
                             400: validation_error_response
                         })
    @action(methods=['post'], detail=False, url_path='login', url_name='login')
    def login(self, request):
        serializer = AuthDataSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(username=request.data['email'], password=request.data['password'])

        if user is None:
            return response_with_detail('A user with this email and password was not found.',
                                        status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return response_with_detail('This user has been deactivated.', status.HTTP_401_UNAUTHORIZED)

        add_auth(request, user)

        return Response(status=status.HTTP_200_OK)

    @swagger_auto_schema(tags=['Аутентификация'],
                         operation_summary="Отзывает данные о аутентификации у пользователя",
                         responses={
                             200: "Аутентификация пользователя отозвана"
                         })
    @action(methods=["get"], detail=False, url_path='logout', url_name='logout')
    def logout(self, request):
        request.session.flush()
        _next = request.GET.get('next', None)
        if not _next is None:
            return redirect(_next)
        return Response(status=status.HTTP_200_OK)

    @swagger_auto_schema(tags=['Аутентификация'],
                         operation_summary='Проверяет наличие данных аутентификации пользователя',
                         responses={
                             200: openapi.Response(
                                 'Заголовки и токен проверены (результаты)',
                                 openapi.Schema(type='object', properties={
                                     'authorized': openapi.Schema(type='boolean')
                                 }))
                         })
    @action(methods=['get'], detail=False, url_path='authenticated', url_name='authenticated')
    def authenticated(self, request):
        result = False
        try:
            auth_result = JWTAuthentication().authenticate(request)
            if auth_result is not None:
                result = True
        except exceptions.AuthenticationFailed:
            pass
        return Response({'authenticated': result}, status=status.HTTP_200_OK)

    @swagger_auto_schema(tags=['Пользователь'],
                         operation_summary='Верифицирует Email пользователя',
                         request_body=CodeSerializer,
                         responses={
                             200: 'Верификация пройдена',
                             400: validation_error_response,
                             401: openapi.Response(
                                 'Код не может быть расшифрован или не верен',
                                 detail_schema)
                         })
    @action(methods=['post'], detail=False, url_path='verify-email', url_name='verify-email')
    def verify_email(self, request):
        serializer = CodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_token_user(serializer.data['code'])

        if user is None:
            return response_with_detail('Invalid verification code.', status.HTTP_401_UNAUTHORIZED)

        user.email_verified = True
        user.save()

        return Response(status=status.HTTP_200_OK)

    @swagger_auto_schema(tags=['Пользователь'],
                         operation_summary='Запрос на восстановление пароля',
                         request_body=EmailSerializer,
                         responses={
                             200: 'Ссылка для изменения пароля отправлена на email (если пользователь существует)',
                             400: validation_error_response
                         })
    @action(methods=['post'], detail=False, url_path='change-password', url_name='change-password')
    def change_password(self, request):
        serializer = EmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = User.objects.get(email=serializer.data['email'])
            send_password_recovery_email(user)
        except User.DoesNotExist:
            pass

        return Response(status=status.HTTP_200_OK)

    @swagger_auto_schema(tags=['Пользователь'],
                         operation_summary='Установка нового пароля',
                         request_body=PasswordRecoveryDataSerializer,
                         responses={
                             200: 'Пароль установлен',
                             400: validation_error_response,
                             401: openapi.Response(
                                 'Код не может быть расшифрован или не верен',
                                 detail_schema)
                         })
    @action(methods=['POST'], detail=False, url_path='set-password', url_name='set-password')
    def set_password(self, request):
        serializer = PasswordRecoveryDataSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_token_user(serializer.data['code'])

        if user is None:
            return response_with_detail('Invalid verification code.', status.HTTP_401_UNAUTHORIZED)

        user.set_password(serializer.data['password'])
        user.save()

        return Response(status=status.HTTP_200_OK)
