from django.urls import re_path

from .views import *

urlpatterns = [
    re_path(r'^reg/?$', RegistrationView.as_view(), name='reg'),
    re_path(r'^unique-email/?$', UniqueEmailView.as_view(), name='unique-email'),
    re_path(r'^auth/?$', AuthenticationView.as_view(), name='auth'),
    re_path(r'^valid-token/?$', ValidTokenView.as_view(), name='valid-token'),
    re_path(r'^user/?$', UserDetail.as_view(), name='user-detail'),
    re_path(r'^test/?$', TestView.as_view(), name='test'),
    re_path(r'^manager-test/?$', ManagerTestView.as_view(), name='manager-test')
]
