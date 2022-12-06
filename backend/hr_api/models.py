import os

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core import validators
from django.db import models
from django.db.models.signals import post_save
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


def get_upload_path(instance, filename):
    date = timezone.now().strftime('%d.%m.%Y')
    filename, ext = os.path.splitext(filename)
    filename = slugify(translit(filename, 'ru', reversed=True))
    result = os.path.join(instance.__class__.__name__, date, f"{filename}{ext}").lower()
    return result


class UserManager(BaseUserManager):
    def _create_user(self, fullname, email, password, **extra_fields):
        user = self.model(fullname=fullname, email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_user(self, fullname, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)

        return self._create_user(fullname, email, password, **extra_fields)

    def create_superuser(self, fullname, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self._create_user(fullname, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    fullname = models.CharField(db_index=True, max_length=255, blank=False)

    email = models.EmailField(validators=[validators.validate_email], unique=True, blank=False)

    is_active = models.BooleanField(default=True)

    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ('fullname',)

    objects = UserManager()

    existing_skills = models.ManyToManyField('Skill', blank=True)

    contact = models.CharField(max_length=255, blank=True)

    EXPERIENCE_CHOICES = [
        ('<1', 'Меньше 1 года'),
        ('1-3', 'От 1 года до 3 лет'),
        ('3-6', 'От 3 до 6 лет'),
        ('>6', 'Больше 6 лет')
    ]

    experience = models.CharField(max_length=3, choices=EXPERIENCE_CHOICES, null=True, blank=True)

    current_department = models.ForeignKey(to='Department', on_delete=models.SET_NULL, null=True, blank=True)

    photo = models.ImageField(upload_to=get_upload_path, blank=True)

    email_verified = models.BooleanField(default=False)

    @property
    def filled(self):
        return self.experience is not None and self.current_department is not None

    @property
    def is_manager(self):
        try:
            _ = self.department
            return True
        except Department.DoesNotExist:
            return False

    @property
    def is_admin(self):
        return self.is_superuser

    def get_full_name(self):
        return self.fullname

    def get_short_name(self):
        return self.fullname

    def __str__(self):
        return f"User({self.fullname}, {self.email})"


class Resume(models.Model):
    employee = models.OneToOneField(to='User', on_delete=models.CASCADE)

    desired_position = models.CharField(max_length=255)

    desired_salary = models.IntegerField()

    desired_employment = models.CharField(max_length=4, choices=EMPLOYMENT_CHOICES)

    desired_schedule = models.CharField(max_length=7, choices=SCHEDULE_CHOICES)

    resume = models.FileField(upload_to=get_upload_path)

    is_active = models.BooleanField()

    modified_at = models.DateTimeField(auto_now=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Resume({self.desired_position}, {self.employee.fullname})"


class Vacancy(models.Model):
    department = models.ForeignKey(to='Department', on_delete=models.CASCADE)

    required_skills = models.ManyToManyField(to='Skill', blank=True)

    position = models.CharField(max_length=255)

    salary = models.IntegerField()

    employment = models.CharField(max_length=4, choices=EMPLOYMENT_CHOICES)

    schedule = models.CharField(max_length=7, choices=SCHEDULE_CHOICES)

    description = models.TextField(blank=True)

    is_active = models.BooleanField()

    modified_at = models.DateTimeField(auto_now=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Vacancies"

    def __str__(self):
        return f"Vacancy({self.position}, {self.department.name})"


class Department(models.Model):
    name = models.CharField(max_length=255)

    manager = models.OneToOneField(to=User, on_delete=models.SET_NULL, null=True, blank=True)

    @staticmethod
    def change_manager_department(sender, instance, created, **kwargs):
        if instance.manager is not None:
            instance.manager.current_department = instance
            instance.manager.save()

    def __str__(self):
        return f"Department({self.name})"


post_save.connect(Department.change_manager_department, sender=Department)


class Skill(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"Skill({self.name})"
