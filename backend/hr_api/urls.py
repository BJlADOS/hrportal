from django.urls import path
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import DefaultRouter

from .views import *

schema_view = get_schema_view(
    openapi.Info(
        title='HR Portal API',
        default_version='v1.2',
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
                    '- Из модели <b>User</b> удалено поле <b>resume</b>\n'
                    '- Ответы вида <code>{"detail": ["string"]}</code>, обратно'
                    ' заменены на <code>{"detail": "string"}</code> для унификации'
                    ' <i>(если это правило не соблюдено - это пропущенная ошибка)</i>\n'
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

urlpatterns = router.urls + [
    path('user/', AuthorizedUserView.as_view(), name='auth-user'),
    path('user/resume/', UserResumeView.as_view(), name='user-resume'),
    path('docs/', schema_view.with_ui('swagger'), name='swagger')
]
