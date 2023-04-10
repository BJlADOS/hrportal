from django.urls import path
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import DefaultRouter

from .views import *

schema_view = get_schema_view(
    openapi.Info(
        title='HR Portal API',
        default_version='v1.1',
        description='Backend API для HR-портала большой IT-компании "Очень интересно" \n'
                    '(Для аутентификации используйте запрос <strong>/login</strong>)\n'
                    '\n'
                    'Изменения с версии <strong>v1</strong>:\n'
                    '- Появилась эта <strong>автогенерируемая</strong> OpenAPI документация\n'
                    '- В моделях резюме и вакансии boolean поле <code>isActive</code>'
                    ' было заменено на string enum поле <code>status</code>\n'
                    '- Резюме и вакансии фильтрутся по статусу\n'
                    '- Ответы вида <code>{"detail": "string"}</code>, там, где они были,'
                    ' заменены на <code>{"detail": ["string"]}</code> для унификации\n'
                    '- запрос <strong>/authorized</strong> переименован в <strong>/authenticated</strong>\n'
                    '- запрос <strong>/recovery-password</strong> переименован в <strong>/change-password</strong>\n'
                    '- запрос <strong>/recovery</strong> переименован в <strong>/set-password</strong>\n'
                    '- запрос <strong>/verification</strong> переименован в <strong>/verify-email</strong>'
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

urlpatterns = router.urls + [
    path('user/', AuthorizedUserView.as_view(), name='auth-user'),
    path('user/resume/', UserResumeView.as_view(), name='user-resume'),
    path('docs/', schema_view.with_ui('swagger'), name='swagger')
]
