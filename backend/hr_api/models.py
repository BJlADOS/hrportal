import jwt
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core import validators
from django.db import models


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

    @property
    def token(self):
        return self._generate_jwt_token()

    def _generate_jwt_token(self):
        payload = {"fullname": self.fullname, "email": self.email}

        return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

    def get_full_name(self):
        return self.fullname

    def get_short_name(self):
        return self.fullname

    def __str__(self):
        return f"User({self.fullname}, {self.email})"


class Department(models.Model):
    name = models.CharField(max_length=255)
    manager = models.OneToOneField(to=User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name
