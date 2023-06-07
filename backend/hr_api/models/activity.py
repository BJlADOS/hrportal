from django.db import models

from .grade import Grade
from .shared import ACTIVITY_STATUS_CHOICES


class Activity(models.Model):
    grade = models.ForeignKey(to=Grade, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, blank=False)
    description = models.TextField(blank=True)
    employee_report = models.TextField(blank=True)
    status = models.CharField(max_length=255, choices=ACTIVITY_STATUS_CHOICES, default=ACTIVITY_STATUS_CHOICES[0][0])

    class Meta:
        verbose_name_plural = 'Activities'

    def __str__(self):
        return f"Activity({self.id}, {self.name})"
