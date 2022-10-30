from django.urls import path

from .views import *

urlpatterns = [
    path('reg/', RegistrationView.as_view(), name='reg'),
    path('unique-email/', UniqueEmailView.as_view(), name='unique-email'),
    path('login/', LoginView.as_view(), name='login'),
    path('authorized/', AuthorizedView.as_view(), name='authorized'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', AuthorizedUserView.as_view(), name='auth-user'),
    path('users/', UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('departments/', DepartmentList.as_view(), name='department-list'),
    path('departments/<int:pk>/', DepartmentDetail.as_view(), name='department-detail'),
    path('skills/', SkillList.as_view(), name='skill-list'),
    path('skills/<int:pk>/', SkillDetail.as_view(), name='skill-detail'),
    path('resumes/', ResumeList.as_view(), name='resume-list'),
    path('resumes/<int:pk>/', ResumeDetail.as_view(), name='resume-detail'),
    path('user/resume/', UserResumeView.as_view(), name='user-resume'),
]
