import django_filters

from .models import *


class ResumeFilter(django_filters.FilterSet):
    salary = django_filters.RangeFilter(field_name='desired_salary')
    employment = django_filters.ChoiceFilter(field_name='desired_employment', choices=EMPLOYMENT_CHOICES)
    schedule = django_filters.ChoiceFilter(field_name='desired_schedule', choices=SCHEDULE_CHOICES)
    skills = django_filters.ModelMultipleChoiceFilter(field_name='employee__existing_skills',
                                                      queryset=Skill.objects.all(),
                                                      conjoined=True)

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
            'skills'
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
