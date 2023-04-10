from django.urls import path
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import DefaultRouter

from .views import *
from .views_dep_skill import *
from .views_reg_auth import *
from .views_user import *

schema_view = get_schema_view(
    openapi.Info(
        title='HR Portal API',
        default_version='v1',
        description='Backend API для HR-портала большой IT-компании "Очень интересно"'
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
    authentication_classes=[JWTAuthentication],
)

router = DefaultRouter()
router.register('', RegistrationView, basename='reg')
router.register('', AuthenticationView, basename='auth')
router.register('users', UserView, basename='user')
router.register('departments', DepartmentView, basename='department')
router.register('skills', SkillView, basename='skill')

urlpatterns = router.urls + [
    path('user/', AuthorizedUserView.as_view(), name='auth-user'),
    path('resumes/', ResumeList.as_view(), name='resume-list'),
    path('resumes/<int:pk>/', ResumeDetail.as_view(), name='resume-detail'),
    path('resumes/<int:pk>/response/', resume_response, name='resume_response'),
    path('vacancies/', VacancyList.as_view(), name='vacancy-list'),
    path('vacancies/<int:pk>/', VacancyDetail.as_view(), name='vacancy-detail'),
    path('vacancies/<int:pk>/response/', vacancy_response, name='vacancy_response'),
    path('user/resume/', UserResumeView.as_view(), name='user-resume'),
    path('docs/', schema_view.with_ui('swagger'), name='swagger')
]
