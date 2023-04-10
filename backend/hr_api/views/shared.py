from drf_yasg import openapi
from drf_yasg.inspectors import CoreAPICompatInspector
from rest_framework.response import Response


def response_with_detail(message, response_status):
    return Response({'detail': [message]}, status=response_status)


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


class VacancyResumeFilterInspector(CoreAPICompatInspector):
    min_max_salary_parameters = [
        openapi.Parameter(name='salary_min', in_=openapi.IN_QUERY,
                          description='Минимальная зарплата', required=False,
                          type=openapi.TYPE_INTEGER),
        openapi.Parameter(name='salary_max', in_=openapi.IN_QUERY,
                          description='Максимальная зарплата', required=False,
                          type=openapi.TYPE_INTEGER)
    ]

    def get_paginator_parameters(self, paginator):
        result = super().get_paginator_parameters(paginator)
        for param in result:
            match param.name:
                case 'limit':
                    param.description = 'Количество результатов, возвращаемых на страницу'
                case 'offset':
                    param.description = 'Индекс, начиная с которого возвращаются результаты'

        return result

    def get_filter_parameters(self, filter_backend):
        result = super().get_filter_parameters(filter_backend)
        for param in result:
            match param.name:
                case 'employment':
                    param.description = 'Занятость'
                    param.enum = ['PART', 'FULL']
                case 'schedule':
                    param.description = 'График'
                    param.enum = ['DISTANT', 'FLEX', 'SHIFT', 'FULL']
                case 'ordering':
                    param.description = 'Сортировка (по зарплате, по времени последнего изменения)'
                    param.enum = ['salary', '-salary', 'time', '-time']
                case 'status':
                    param.description = 'Статус объекта'
                    param.enum = ['PUBLIC', 'ARCHIVED', 'DELETED']
                case 'skills':
                    param.description = 'Список ID навыков'
                    param.type = openapi.TYPE_ARRAY
                case 'department':
                    param.description = 'Список ID отделов'
                    param.type = openapi.TYPE_ARRAY
                case 'search':
                    param.description = 'Поиск по названию должности'

        return [p for p in result if not 'salary' in p.name]
