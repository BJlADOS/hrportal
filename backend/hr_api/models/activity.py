from django.db import models

from .grade import Grade
from .shared import ActivityStatus, ACTIVITY_STATUS_CHOICES


class Activity(models.Model):
    grade = models.ForeignKey(to=Grade, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, blank=False)
    description = models.TextField(blank=True)
    employee_report = models.TextField(blank=True)
    status = models.CharField(max_length=255, choices=ACTIVITY_STATUS_CHOICES, default=ActivityStatus.IN_WORK.value)

    class Meta:
        verbose_name_plural = 'Activities'

    def __str__(self):
        return f"Activity({self.id}, {self.name})"

    def to_review(self, report: str = None) -> bool:
        if self.status in [ActivityStatus.IN_WORK.value, ActivityStatus.RETURNED.value]:
            self.status = ActivityStatus.ON_REVIEW.value
            if report is not None:
                self.employee_report = report
            self.save()
            return True
        return False

    def return_activity(self) -> bool:
        if self.status == ActivityStatus.ON_REVIEW.value:
            self.status = ActivityStatus.RETURNED.value
            self.save()
            return True
        return False

    def complete(self) -> bool:
        self.status = ActivityStatus.COMPLETED.value
        self.save()
        return True

    def cancel(self) -> bool:
        self.status = ActivityStatus.CANCELED.value
        self.save()
        return True
