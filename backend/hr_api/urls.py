from django.urls import path

from .views import *

urlpatterns = [
    path('reg/', registration_view, name='reg'),
    path('unique-email/', unique_email_view, name='unique-email'),
    path('login/', login_view, name='login'),
    path('authorized/', authorized_view, name='authorized'),
    path('logout/', logout_view, name='logout'),
    path('user/', AuthorizedUserView.as_view(), name='auth-user'),
    path('users/', UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('resumes/', ResumeList.as_view(), name='resume-list'),
    path('resumes/<int:pk>/', ResumeDetail.as_view(), name='resume-detail'),
    path('resumes/<int:pk>/response', resume_response, name='resume_response'),
    path('vacancies/', VacancyList.as_view(), name='vacancy-list'),
    path('vacancies/<int:pk>/', VacancyDetail.as_view(), name='vacancy-detail'),
    path('user/resume/', UserResumeView.as_view(), name='user-resume'),
    path('departments/', DepartmentList.as_view(), name='department-list'),
    path('departments/<int:pk>/', DepartmentDetail.as_view(), name='department-detail'),
    path('skills/', SkillList.as_view(), name='skill-list'),
    path('skills/<int:pk>/', SkillDetail.as_view(), name='skill-detail'),
]
