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
        if not self.is_active:
            return False
        self.status = ActivityStatus.ON_REVIEW.value
        if report is not None:
            self.employee_report = report
        self.save()
        return True

    def return_activity(self) -> bool:
        if not self.on_review:
            return False
        self.status = ActivityStatus.RETURNED.value
        self.save()
        return True

    def complete(self) -> bool:
        if self.is_finalized:
            return False
        self.status = ActivityStatus.COMPLETED.value
        self.save()
        return True

    def cancel(self) -> bool:
        if self.is_finalized:
            return False
        self.status = ActivityStatus.CANCELED.value
        self.save()
        return True

    @property
    def is_active(self) -> bool:
        return self.status == ActivityStatus.IN_WORK.value \
            or self.status == ActivityStatus.RETURNED.value

    @property
    def on_review(self) -> bool:
        return self.status == ActivityStatus.ON_REVIEW.value

    @property
    def is_canceled(self) -> bool:
        return self.status == ActivityStatus.CANCELED.value

    @property
    def is_completed(self) -> bool:
        return self.status == ActivityStatus.COMPLETED.value

    @property
    def is_finalized(self) -> bool:
        return self.is_completed or self.is_canceled
