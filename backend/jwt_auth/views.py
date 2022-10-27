from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User


class RegistrationView(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def post(request):
        fullname = request.data['fullname']
        email = request.data['email']
        password = request.data['password']

        user = User.objects.create_user(fullname, email, password)

        return Response({'token': user.token}, status=status.HTTP_200_OK)


class AuthenticationView(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def get(request):
        email = request.data['email']
        password = request.data['password']

        user = authenticate(email=email, password=password)

        return Response({'token': user.token}, status=status.HTTP_200_OK)


class TestView(APIView):
    @staticmethod
    def get(request):
        return Response({'detail': 'Authentication passed'}, status=status.HTTP_200_OK)
