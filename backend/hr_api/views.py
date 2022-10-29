from django.contrib.auth import authenticate
from rest_framework import status, exceptions, generics
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .authentication import JWTAuthentication
from .permissions import IsManagerUser
from .serializers import *


class RegistrationView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    serializer_class = RegistrationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_201_CREATED)


class LoginView(APIView):
    authentication_classes = []
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

        add_auth(request, user)

        return Response(status=status.HTTP_200_OK)


class LogoutView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    @staticmethod
    def get(request):
        request.session.flush()
        return Response(status=status.HTTP_200_OK)


class AuthorizedView(APIView):
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
        return Response({'authorized': result}, status=status.HTTP_200_OK)


class UniqueEmailView(APIView):
    authentication_classes = []
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


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = GetUserSerializer
    permission_classes = [IsManagerUser | IsAdminUser]


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = GetUserSerializer
    permission_classes = [IsManagerUser | IsAdminUser]


class AuthorizedUserDetail(APIView):
    @staticmethod
    def get(request):
        serializer = GetUserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def patch(request):
        user = request.user
        put_serializer = PutUserSerializer(user, data=request.data)
        put_serializer.is_valid(raise_exception=True)
        put_serializer.save()

        add_auth(request, user)
        get_serializer = GetUserSerializer(user)
        return Response(get_serializer.data, status=status.HTTP_200_OK)


class DepartmentList(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]


class DepartmentDetail(generics.RetrieveDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminUser]


class SkillList(generics.ListCreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]


class SkillDetail(generics.RetrieveDestroyAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAdminUser]


class ResumeList(generics.ListAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [IsManagerUser | IsAdminUser]


class ResumeDetail(generics.RetrieveAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [IsManagerUser | IsAdminUser]


class UserResumeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer


def add_auth(request, user):
    request.session['Authorization'] = f'Bearer {user.token}'


def response_with_detail(message, response_status):
    return Response({'detail': message}, status=response_status)
