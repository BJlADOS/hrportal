from drf_yasg import openapi
from rest_framework.response import Response


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
