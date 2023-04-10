from django.urls import path
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import DefaultRouter

from .views import *

schema_view = get_schema_view(
    openapi.Info(
        title='HR Portal API',
        default_version='v1',
        description='Backend API для HR-портала большой IT-компании "Очень интересно" \n'
                    '(Для аутентификации используйте запрос <strong>/login</strong>)'
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
