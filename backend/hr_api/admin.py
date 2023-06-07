from django.contrib import admin

from .models import *


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'fullname', 'email', 'email_verified', 'filled_view', 'is_manager_view', 'admin_view')
    list_display_links = ('fullname', 'email',)
    list_filter = ('is_superuser', 'email_verified')
    search_fields = ('fullname', 'email',)
    ordering = ('id',)

    @admin.display(boolean=True, description="is admin")
    def admin_view(self, obj):
        return obj.is_admin

    @admin.display(boolean=True, description="is manager")
    def is_manager_view(self, obj):
        return obj.is_manager

    @admin.display(boolean=True, description="profile filled")
    def filled_view(self, obj):
        return obj.filled


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('id', 'desired_position', 'employee_fullname_view', 'status', 'modified_at',)
    list_display_links = ('desired_position',)
    list_filter = ('status', 'desired_employment', 'desired_schedule',)
    search_fields = ('desired_position',)
    ordering = ('id', 'modified_at',)

    @admin.display(description="employee")
    def employee_fullname_view(self, obj):
        if obj.employee is None:
            return None
        else:
            return obj.employee.fullname


@admin.register(Vacancy)
class VacancyAdmin(admin.ModelAdmin):
    list_display = ('id', 'position', 'department_name_view', 'status', 'modified_at',)
    list_display_links = ('position',)
    list_filter = ('status', 'employment', 'schedule',)
    search_fields = ('position',)
    ordering = ('id', 'modified_at',)

    @admin.display(description="department")
    def department_name_view(self, obj):
        return obj.department.name if obj.department is not None else None


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    list_display_links = ('name',)
    search_fields = ('name',)
    ordering = ('id',)


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'manager_name_view')
    list_display_links = ('name',)
    search_fields = ('name',)
    ordering = ('id',)

    @admin.display(description="manager")
    def manager_name_view(self, obj):
        return obj.manager.fullname if obj.manager else None


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'owner', 'read', 'notify_time')
    list_display_links = ('type',)
    list_filter = ('read', 'type')
    ordering = ('id', 'notify_time')


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'employee', 'in_work', 'expiration_date')
    list_display_links = ('name',)
    list_filter = ('in_work',)
    ordering = ('id', 'expiration_date')


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'grade', 'employee_view', 'status')
    list_display_links = ('name',)
    list_filter = ('status',)
    ordering = ('id',)

    @admin.display(description="employee")
    def employee_view(self, obj):
        return obj.grade.employee
