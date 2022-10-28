from rest_framework import permissions

from .models import Department


class Manager(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            try:
                _ = request.user.department
                return True
            except Department.DoesNotExist:
                pass
        return False


class Admin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.is_superuser:
            return True
        return False
