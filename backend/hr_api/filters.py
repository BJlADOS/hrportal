import django_filters

from .models import *


class ResumeFilter(django_filters.FilterSet):
    salary = django_filters.RangeFilter(field_name='desired_salary')
    employment = django_filters.ChoiceFilter(field_name='desired_employment', choices=EMPLOYMENT_CHOICES)
    schedule = django_filters.ChoiceFilter(field_name='desired_schedule', choices=SCHEDULE_CHOICES)
    skills = django_filters.ModelMultipleChoiceFilter(field_name='employee__existing_skills',
                                                      queryset=Skill.objects.all(),
                                                      conjoined=True)
    status = django_filters.ChoiceFilter(field_name='status', choices=STATUS_CHOICES)
    employeeDepartment = django_filters.ModelChoiceFilter(field_name='employee__current_department',
                                                          queryset=Department.objects.all())

    ordering = django_filters.OrderingFilter(fields=[
        ('desired_salary', 'salary'),
        ('modified_at', 'time')
    ])

    class Meta:
        model = Resume
        fields = [
            'salary',
            'employment',
            'schedule',
            'skills',
            'status'
        ]


class VacancyFilter(django_filters.FilterSet):
    salary = django_filters.RangeFilter()
    skills = django_filters.ModelMultipleChoiceFilter(field_name='required_skills',
                                                      queryset=Skill.objects.all(),
                                                      conjoined=True)
    department = django_filters.ModelMultipleChoiceFilter(field_name='department',
                                                          queryset=Department.objects.all(),
                                                          conjoined=False)
    status = django_filters.ChoiceFilter(field_name='status', choices=STATUS_CHOICES)

    ordering = django_filters.OrderingFilter(fields=[
        ('salary', 'salary'),
        ('modified_at', 'time')
    ])

    class Meta:
        model = Vacancy
        fields = [
            'salary',
            'employment',
            'schedule',
            'skills',
            'department',
            'status'
        ]


class UserFilter(django_filters.FilterSet):
    department = django_filters.ModelMultipleChoiceFilter(field_name='current_department',
                                                          queryset=Department.objects.all(),
                                                          conjoined=False)
    experience = django_filters.ChoiceFilter(field_name='experience', choices=User.EXPERIENCE_CHOICES)
    active = django_filters.BooleanFilter(field_name='is_active')
    skills = django_filters.ModelMultipleChoiceFilter(field_name='existing_skills',
                                                      queryset=Skill.objects.all(),
                                                      conjoined=True)

    class Meta:
        model = User
        fields = [
            'department',
            'experience',
            'active',
            'skills'
        ]
