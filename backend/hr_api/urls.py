from django.urls import path, re_path

from .views import *

urlpatterns = [
    re_path(r'^reg/?$', RegistrationView.as_view(), name='reg'),
    re_path(r'^unique-email/?$', UniqueEmailView.as_view(), name='unique-email'),
    re_path(r'^login/?$', LoginView.as_view(), name='login'),
    re_path(r'^authorized/?$', AuthorizedView.as_view(), name='authorized'),
    re_path(r'^logout/?$', LogoutView.as_view(), name='logout'),
    re_path(r'^user/?$', UserDetail.as_view(), name='user-detail'),
    path('departments/', DepartmentList.as_view(), name='department-list'),
    path('departments/<int:pk>/', DepartmentDetail.as_view(), name='department-detail'),
    path('skills/', SkillList.as_view(), name='skill-list'),
    path('skills/<int:pk>/', SkillDetail.as_view(), name='skill-detail'),
    re_path(r'^test/?$', TestView.as_view(), name='test'),
    re_path(r'^manager-test/?$', ManagerTestView.as_view(), name='manager-test')
]
