from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core import validators
from django.db import models

from .department import Department
from .shared import get_upload_path


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

    def get_existing_resume(self):
        return self.resume_set.exclude(status='DELETED').first()

    def get_full_name(self):
        return self.fullname

    def get_short_name(self):
        return self.fullname

    def deactivate(self):
        self.is_active = False
        self.save()
        for resume in self.resume_set.all():
            resume.archive()

    def __str__(self):
        return f"User({self.fullname}, {self.email})"
