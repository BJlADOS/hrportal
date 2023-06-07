from django.urls import path
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import DefaultRouter

from .views import *

schema_view = get_schema_view(
    openapi.Info(
        title='HR Portal API',
        default_version='v1.4',
        description='Backend API для HR-портала большой IT-компании "Очень интересно" \n'
                    '(Для аутентификации используйте запрос <b>/login</b>)\n'
                    '\n'
                    'Изменения с версии <b>v1</b>:\n'
                    '- Появилась эта <b>автогенерируемая</b> OpenAPI документация\n'
                    '- В моделях резюме и вакансии boolean поле <code>isActive</code>'
                    ' было заменено на string enum поле <code>status</code>\n'
                    '- Резюме и вакансии фильтрутся по статусу\n'
                    '- <s>Ответы вида <code>{"detail": "string"}</code>, там, где они были,'
                    ' заменены на <code>{"detail": ["string"]}</code> для унификации</s>\n'
                    '- Запрос <b>/authorized</b> переименован в <b>/authenticated</b>\n'
                    '- Запрос <b>/recovery-request</b> переименован в <b>/change-password</b>\n'
                    '- Запрос <b>/recovery</b> переименован в <b>/set-password</b>\n'
                    '- Запрос <b>/verification</b> переименован в <b>/verify-email</b>\n'
                    '\nИзменения с версии <b>v1.1</b>:\n'
                    '- Добавлены фильтры и пагинация в запрос GET <b>/users</b>\n'
                    '- Добавлены запросы для деактивации и окончательного удаления пользователя\n'
                    '- Добавлены запросы для окончательного удаления вакансии и резюме\n'
                    '- В модель <b>User</b> добавлено поле <b>isActive</b>\n'
                    '- <s>Из модели <b>User</b> удалено поле <b>resumeId</b></s>\n'
                    '- Ответы вида <code>{"detail": ["string"]}</code>, обратно'
                    ' заменены на <code>{"detail": "string"}</code> для унификации'
                    ' <i>(если это правило не соблюдено - это пропущенная ошибка)</i>\n'
                    '\nИзменения с версии <b>v1.2</b>:\n'
                    '- В модели Резюме поле <code>resume</code> переименовано в <code>file</code>\n'
                    '- Добавлены запросы для уведомлений. <a href="https://www.notion.so/725dc127beea4f30be0ab8a188d06aa2">Документация по содержимому уведомлений</a>\n'
                    '- При отклике на вакансию теперь автоматически рассылаются уведомления (как и email-отклики)\n'
                    '- Критические изменения в модели данных - <b>необходимо</b> сбросить БД (<code>python manage.py flush</code>)\n'
                    '- В модель <b>User</b> возвращено поле <b>resumeId</b>\n'
                    '- Добавлена фильтрация резюме по отделу сотрудника\n'
                    '\nИзменения с версии <b>v1.3</b>:\n'
                    '- Добавлены запросы из категории "Грейды"\n'
                    '- Добавлены запросы из категории "Активности"\n'
                    '- В категорию "Пользователь" добавлен запрос <code>GET /users/{id}/grades</code>\n'
                    '- Добавлены уведомления активностей <i>(менеджеру - при отправке на согласование, сотруднику - при решении на согласовании)</i>\n'
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
    authentication_classes=[JWTAuthentication],
)

router = DefaultRouter()
router.register('', RegistrationView, basename='reg')
router.register('', AuthenticationView, basename='auth')
router.register('users', UserView, basename='user')
router.register('vacancies', VacancyView, basename='vacancy')
router.register('resumes', ResumeView, basename='resume')
router.register('skills', SkillView, basename='skill')
router.register('departments', DepartmentView, basename='department')
router.register('user/notifications', NotificationView, basename='notification')
router.register('grades', GradeView, basename='grade')
router.register('activities', ActivityView, basename='activity')

urlpatterns = router.urls + [
    path('user/', AuthorizedUserView.as_view(), name='auth-user'),
    path('user/resume/', UserResumeView.as_view(), name='user-resume'),
    path('docs/', schema_view.with_ui('swagger'), name='swagger')
]
