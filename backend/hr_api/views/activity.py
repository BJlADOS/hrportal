from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework.viewsets import ReadOnlyModelViewSet

from ..models import Activity
from ..serializers import ActivitySerializer


@method_decorator(name='list', decorator=swagger_auto_schema(
    tags=['Активности'],
    operation_summary='Все активности'
))
@method_decorator(name='retrieve', decorator=swagger_auto_schema(
    tags=['Активности'],
    operation_summary='Активность по ID'
))
class ActivityView(ReadOnlyModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
