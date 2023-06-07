import os
from enum import Enum

from django.utils import timezone
from django.utils.text import slugify
from transliterate import translit

SCHEDULE_CHOICES = [
    ('DISTANT', 'Удаленная работа'),
    ('FLEX', 'Гибкий график'),
    ('SHIFT', 'Сменный график'),
    ('FULL', 'Полная работа')
]

EMPLOYMENT_CHOICES = [
    ('PART', 'Частичная занятость'),
    ('FULL', 'Полная занятость'),
]

STATUS_CHOICES = [
    ('PUBLIC', 'Публично'),
    ('ARCHIVED', 'Архивировано'),
    ('DELETED', 'Удалено')
]


class ActivityStatus(Enum):
    IN_WORK = 'inWork'
    ON_REVIEW = 'onReview'
    RETURNED = 'returned'
    COMPLETED = 'completed'
    CANCELED = 'canceled'


ACTIVITY_STATUS_CHOICES = [
    (ActivityStatus.IN_WORK.value, 'В работе'),
    (ActivityStatus.ON_REVIEW.value, 'На согласовании'),
    (ActivityStatus.RETURNED.value, 'Возвращена'),
    (ActivityStatus.COMPLETED.value, 'Выполнена'),
    (ActivityStatus.CANCELED.value, 'Отменена'),
]


def get_upload_path(instance, filename):
    date = timezone.now().strftime('%d.%m.%Y')
    filename, ext = os.path.splitext(filename)
    filename = slugify(translit(filename, 'ru', reversed=True))
    result = os.path.join(instance.__class__.__name__, date, f"{filename}{ext}").lower()
    return result
