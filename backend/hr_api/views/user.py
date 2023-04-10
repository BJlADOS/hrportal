from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet

from .shared import validation_error_response, forbidden_response, not_found_response
from ..authentication import add_auth
from ..models import User
from ..permissions import IsManagerUser
from ..serializers import UserSerializer, UserPatchDataSerializer


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
class UserView(ReadOnlyModelViewSet):
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
                         operation_summary='Информация о авторизованном пользователе',
                         responses={
                             200: UserSerializer(),
                             403: forbidden_response
                         })
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=HTTP_200_OK)

    @swagger_auto_schema(tags=['Пользователь'],
                         operation_summary='Редактирует профиль авторизованного пользователя',
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
        return Response(get_serializer.data, status=HTTP_200_OK)
