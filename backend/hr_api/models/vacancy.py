from django.db import models

from .shared import *


class Vacancy(models.Model):
    department = models.ForeignKey(to='Department', on_delete=models.SET_NULL, null=True)

    required_skills = models.ManyToManyField(to='Skill', blank=True)

    position = models.CharField(max_length=255)

    salary = models.IntegerField()

    employment = models.CharField(max_length=4, choices=EMPLOYMENT_CHOICES)

    schedule = models.CharField(max_length=7, choices=SCHEDULE_CHOICES)

    description = models.TextField(blank=True)

    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default=STATUS_CHOICES[0][0])

    modified_at = models.DateTimeField(auto_now=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Vacancies"

    def publish(self):
        self.status = 'PUBLIC'
        self.save()

    def archive(self):
        self.status = 'ARCHIVED'
        self.save()

    def soft_delete(self):
        self.status = 'DELETED'
        self.save()

    def __str__(self):
        return f"Vacancy({self.position}, {self.department.name})"
