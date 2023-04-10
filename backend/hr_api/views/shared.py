from datetime import datetime

from drf_yasg import openapi
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.serializers import Field


# TODO message to [message]
def response_with_detail(message, response_status):
    return Response({'detail': message}, status=response_status)


detail_schema = openapi.Schema(type='object', properties={
    'detail': openapi.Schema(
        type='array',
        items=openapi.Schema(type='string'))
})

validation_error_response = openapi.Response(
    'Данные не прошли валидацию (причины)',
    openapi.Schema(type='object', properties={
        '{field}': openapi.Schema(
            type='array',
            items=openapi.Schema(type='string'))
    }))

forbidden_response = openapi.Response(
    'Доступ запрещен (пользователь не аутентифицирован или не имеет прав на выполнение операции)',
    detail_schema
)

not_found_response = openapi.Response(
    'Объект не найден',
    detail_schema
)


class TimestampField(Field):
    def to_internal_value(self, timestamp):
        return datetime.fromtimestamp(timestamp / 1000)

    def to_representation(self, date):
        return int(date.timestamp()) * 1000


def validate_filesize(max_filesize):
    def return_function(value):
        if value.size > max_filesize:
            raise ValidationError(f"You cannot upload file more than {max_filesize} bytes")
        else:
            return value

    return return_function
