from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import serializers
from rest_framework import status, viewsets
from rest_framework.parsers import *
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from rest_framework.views import APIView

from .dep_and_skill import DepartmentSerializer, SkillSerializer
from .shared import validation_error_response, forbidden_response, not_found_response
from ..authentication import add_auth
from ..models import User, Skill, Department
from ..permissions import IsManagerUser


class UserSerializer(serializers.ModelSerializer):
    currentDepartment = DepartmentSerializer(source='current_department')
    existingSkills = SkillSerializer(source='existing_skills', many=True)
    isManager = serializers.BooleanField(source='is_manager')
    isAdmin = serializers.BooleanField(source='is_admin')
    emailVerified = serializers.BooleanField(source='email_verified')
    resumeId = serializers.PrimaryKeyRelatedField(source='resume', read_only=True)
    photo = serializers.ImageField(use_url=False)

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
            'isAdmin',
            'emailVerified'
        ]


class UserPatchDataSerializer(serializers.ModelSerializer):
    fullname = serializers.CharField(required=False, help_text='ФИО пользователя')
    email = serializers.EmailField(required=False, help_text='Email пользователя')
    contact = serializers.CharField(required=False, allow_null=True, help_text='Дополнительный контакт')
    experience = serializers.ChoiceField(required=False, allow_null=True, choices=User.EXPERIENCE_CHOICES,
                                         help_text='Стаж работы в компании')
    photo = serializers.ImageField(required=False, allow_null=True,
                                   help_text='Аватар пользователя')
    currentDepartmentId = serializers.PrimaryKeyRelatedField(source='current_department', required=False,
                                                             allow_null=True, queryset=Department.objects.all(),
                                                             help_text='ID отдела, в котором работает пользователь')
    existingSkillsIds = serializers.PrimaryKeyRelatedField(source='existing_skills', required=False, many=True,
                                                           queryset=Skill.objects.all(),
                                                           help_text='ID навыков, которыми владеет пользователь')

    def validate(self, attrs):
        if self.instance.is_manager and \
                'current_department' in attrs and \
                self.instance.department != attrs['current_department']:
            raise ValidationError(
                {'currentDepartmentId': f'User is manager of department {self.instance.department}'
                                        f' and therefore cannot be in another department'})
        return super(UserPatchDataSerializer, self).validate(attrs)

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


@method_decorator(name='list', decorator=swagger_auto_schema(
    tags=['Пользователь'],
    operation_summary='Все пользователи',
    responses={
        403: forbidden_response
    }
))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(
    tags=['Пользователь'],
    operation_summary='Пользователь по его ID',
    responses={
        403: forbidden_response,
        404: not_found_response,
    }
))
class UserView(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsManagerUser | IsAdminUser]


class AuthorizedUserView(APIView):
    def get_parsers(self):
        if 'docs' in self.request.path and self.request.method == 'PATCH':
            return [MultiPartParser]
        else:
            return super().get_parsers()

    @swagger_auto_schema(tags=['Пользователь'],
                         operation_summary='Информация о аутентифицированном пользователе',
                         responses={
                             200: UserSerializer(),
                             403: forbidden_response
                         })
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(tags=['Пользователь'],
                         operation_summary='Редактирует профиль аутентифицированного пользователя',
                         request_body=UserPatchDataSerializer,
                         responses={
                             200: UserSerializer(),
                             400: validation_error_response,
                             403: forbidden_response
                         })
    def patch(self, request):
        user = request.user
        put_serializer = UserPatchDataSerializer(user, data=request.data)
        put_serializer.is_valid(raise_exception=True)
        put_serializer.save()

        add_auth(request, user)
        get_serializer = UserSerializer(user)
        return Response(get_serializer.data, status=status.HTTP_200_OK)
