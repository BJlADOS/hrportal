from rest_framework import permissions


class IsManagerUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_manager

    def has_object_permission(self, request, view, obj):
        return request.method in permissions.SAFE_METHODS \
            or hasattr(obj, 'department') and request.user.department == obj.department \
            or hasattr(obj, 'employee') and request.user.department == obj.employee.current_department \
            or hasattr(obj, 'grade') and request.user.department == obj.grade.employee.current_department


class IsEmployeeOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return request.user == obj \
            or hasattr(obj, 'employee') and request.user == obj.employee \
            or hasattr(obj, 'grade') and request.user == obj.grade.employee
