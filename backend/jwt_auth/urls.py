from django.urls import re_path

from .views import AuthenticationView, RegistrationView

urlpatterns = [
    re_path(r'^reg/?$', RegistrationView.as_view(), name='reg'),
    re_path(r'^auth/?$', AuthenticationView.as_view(), name='auth'),
]