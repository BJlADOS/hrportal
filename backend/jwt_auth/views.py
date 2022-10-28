from django.contrib.auth import authenticate
from rest_framework import status, exceptions
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .authentication import JWTAuthentication

from .models import User


class RegistrationView(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        fullname = request.data['fullname']
        email = request.data['email']
        password = request.data['password']

        User.objects.create_user(fullname, email, password)

        return Response(status=status.HTTP_200_OK)


class AuthenticationView(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        email = request.data['email']
        password = request.data['password']

        user = authenticate(email=email, password=password)

        return Response({'token': user.token}, status=status.HTTP_200_OK) if user is not None else \
            response_with_detail("User don't exist or wrong password", status.HTTP_401_UNAUTHORIZED)


class ValidTokenView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    @staticmethod
    def get(request):
        result = False
        try:
            auth_result = JWTAuthentication().authenticate(request)
            if auth_result is not None:
                result = True
        except exceptions.AuthenticationFailed:
            pass
        return Response({'valid': result}, status=status.HTTP_200_OK)


class UniqueEmailView(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        email = request.data['email']
        result = True
        try:
            User.objects.get(email=email)
            result = False
        except User.DoesNotExist:
            pass
        return Response({'unique': result}, status=status.HTTP_200_OK)


class TestView(APIView):
    @staticmethod
    def get(request):
        return response_with_detail('Authentication passed', status.HTTP_200_OK)


def response_with_detail(message, response_status):
    return Response({'detail': message}, status=response_status)
