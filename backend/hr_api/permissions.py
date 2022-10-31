from rest_framework import permissions


class IsManagerUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_manager

    def has_object_permission(self, request, view, obj):
        return request.user.department == obj.department

