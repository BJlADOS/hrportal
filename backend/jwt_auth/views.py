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

        return Response({'token': user.token}, status=status.HTTP_200_OK)


class ValidTokenView(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        token = request.data['token']
        result = False
        try:
            JWTAuthentication.authenticate_credentials(token)
            result = True
        except exceptions.AuthenticationFailed:
            pass
        return Response({'valid': result}, status=status.HTTP_200_OK)


class TestView(APIView):
    @staticmethod
    def get(request):
        return Response({'detail': 'Authentication passed'}, status=status.HTTP_200_OK)
