from django.utils.decorators import method_decorator
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .shared import forbidden_response, not_found_response, detail_schema
from .shared import response_with_detail
from ..models import Activity, User, ActivityStatus, Notification
from ..permissions import IsEmployeeOwner, IsManagerUser
from ..serializers import ActivitySerializer, ActivityPatchDataSerializer, ActivityPostDataSerializer, \
    ActivityReportSerializer


@method_decorator(name='list', decorator=swagger_auto_schema(
    tags=['Активности'],
    operation_summary='Все активности',
    responses={
        403: forbidden_response
    }
))
@method_decorator(name='create', decorator=swagger_auto_schema(
    tags=['Активности'],
    operation_summary='Создает активность',
    responses={
        200: ActivitySerializer,
        403: forbidden_response
    }
))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(
    tags=['Активности'],
    operation_summary='Активность по ID',
    responses={
        403: forbidden_response,
        404: not_found_response
    }
))
@method_decorator(name='partial_update', decorator=swagger_auto_schema(
    tags=['Активности'],
    operation_summary='Изменить активность по ID',
    responses={
        200: ActivitySerializer,
        403: forbidden_response,
        404: not_found_response,
    }
))
@method_decorator(name='destroy', decorator=swagger_auto_schema(
    tags=['Активности'],
    operation_summary='Удалить активность по ID',
    responses={
        403: forbidden_response,
        404: not_found_response,
    }
))
class ActivityView(ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ActivitySerializer
        if self.action == 'create':
            return ActivityPostDataSerializer
        if self.action == 'partial_update':
            return ActivityPatchDataSerializer
        if self.action == 'to_review':
            return ActivityReportSerializer
        else:
            return None

    def get_permissions(self):
        if self.action == 'to_review':
            return [IsEmployeeOwner()]
        if self.action == 'on_review':
            return [IsManagerUser()]
        if self.request.method == 'GET':
            return [(IsEmployeeOwner | IsManagerUser | IsAdminUser)()]
        else:
            return [(IsManagerUser | IsAdminUser)()]

    @swagger_auto_schema(
        tags=['Активности'],
        operation_summary='Отправить активность на согласование',
        responses={
            200: 'OK',
            400: openapi.Response(
                'Отправка не удалась, активность не находится в статусе inWork или returned',
                detail_schema
            ),
            403: forbidden_response,
            404: not_found_response
        })
    @action(methods=['patch'], detail=True, url_path='toReview', url_name='to-review')
    def to_review(self, request, pk):
        activity = self.get_object()
        if activity.to_review(request.data.get('employeeReport', None)):
            department = request.user.current_department
            if department is not None and department.manager is not None:
                Notification.activity_to_review(department.manager, request.user, activity)
            return Response(status=status.HTTP_200_OK)
        return response_with_detail(f'Failed to submit activity for review - it\'s {activity.status}',
                                    status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        tags=['Активности'],
        operation_summary='Вернуть активность исполнителю',
        responses={
            200: 'OK',
            400: openapi.Response(
                'Не удалось вернуть активность - она не на согласовании',
                detail_schema
            ),
            403: forbidden_response,
            404: not_found_response
        })
    @action(methods=['patch'], detail=True, url_path='return', url_name='return')
    def return_activity(self, request, pk):
        activity = self.get_object()
        if activity.return_activity():
            Notification.activity_review_decision(activity.grade.employee, request.user, activity,
                                                  ActivityStatus.RETURNED)
            return Response(status=status.HTTP_200_OK)
        return response_with_detail('Failed to return activity - it\'s not on review', status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        tags=['Активности'],
        operation_summary='Отметить активность как выполненную',
        responses={
            200: 'OK',
            400: openapi.Response(
                'Не удалось завершить активность, она уже в конечном состоянии',
                detail_schema
            ),
            403: forbidden_response,
            404: not_found_response
        })
    @action(methods=['patch'], detail=True, url_path='complete', url_name='complete')
    def complete(self, request, pk):
        activity = self.get_object()
        if activity.complete():
            Notification.activity_review_decision(activity.grade.employee, request.user, activity,
                                                  ActivityStatus.COMPLETED)
            return Response(status=status.HTTP_200_OK)
        return response_with_detail('Failed to complete activity - it\'s in final state', status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        tags=['Активности'],
        operation_summary='Отменить выполнение активности',
        responses={
            200: 'OK',
            400: openapi.Response(
                'Не удалось отменить активность, она уже в конечном состоянии',
                detail_schema
            ),
            403: forbidden_response,
            404: not_found_response
        })
    @action(methods=['patch'], detail=True, url_path='cancel', url_name='cancel')
    def cancel(self, request, pk):
        activity = self.get_object()
        if activity.cancel():
            Notification.activity_review_decision(activity.grade.employee, request.user, activity,
                                                  ActivityStatus.CANCELED)
            return Response(status=status.HTTP_200_OK)
        return response_with_detail('Failed to cancel activity - it\'s in final state', status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        tags=['Активности'],
        operation_summary='Список активностей на согласовании (для руководителя)',
        responses={
            200: ActivitySerializer(many=True),
            403: forbidden_response
        })
    @action(methods=['get'], detail=False, url_path='onReview', url_name='list-on-review')
    def on_review(self, request):
        manager: User = request.user
        department = manager.current_department
        activities = Activity.objects.filter(status=ActivityStatus.ON_REVIEW.value,
                                             grade__employee__current_department=department)
        return Response(ActivitySerializer(activities, many=True).data)
