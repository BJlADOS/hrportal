from django.contrib.auth import authenticate
from rest_framework import status, exceptions, generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .authentication import JWTAuthentication
from .permissions import Manager
from .serializers import *


class RegistrationView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RegistrationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_201_CREATED)


class AuthenticationView(APIView):
    permission_classes = [AllowAny]
    serializer_class = AuthSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(username=request.data['email'], password=request.data['password'])

        if user is None:
            return response_with_detail('A user with this email and password was not found.',
                                        status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return response_with_detail('This user has been deactivated.', status.HTTP_401_UNAUTHORIZED)

        return Response({'token': user.token}, status=status.HTTP_200_OK)


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
    serializer_class = UniqueEmailSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = True
        try:
            User.objects.get(email=request.data['email'])
            result = False
        except User.DoesNotExist:
            pass
        return Response({'unique': result}, status=status.HTTP_200_OK)


class UserDetail(APIView):
    serializer_class = UserSerializer

    def get(self, request):
        serializer = self.serializer_class(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DepartmentList(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class DepartmentDetail(generics.RetrieveDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class SkillList(generics.ListCreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


class SkillDetail(generics.RetrieveDestroyAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


class TestView(APIView):
    @staticmethod
    def get(request):
        return response_with_detail('Authentication passed', status.HTTP_200_OK)


class ManagerTestView(APIView):
    permission_classes = [Manager]

    @staticmethod
    def get(request):
        return response_with_detail('Authentication passed', status.HTTP_200_OK)


def response_with_detail(message, response_status):
    return Response({'detail': message}, status=response_status)
