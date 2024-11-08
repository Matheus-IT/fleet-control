from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
    User,
)
from django.utils.translation import gettext_lazy as _
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=50, default="")
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    DRIVER_PROFILE = "driver"
    SUPERVISOR_PROFILE = "supervisor"
    PROFILES = {
        DRIVER_PROFILE: "Motorista",
        SUPERVISOR_PROFILE: "Supervisor",
    }

    def __str__(self):
        return self.email

    @property
    def profiles(self):
        profiles = []
        if hasattr(self, "supervisor"):
            profiles.append(self.SUPERVISOR_PROFILE)
        if hasattr(self, "driver"):
            profiles.append(self.DRIVER_PROFILE)
        return profiles or None

    @property
    def profiles_display(self):
        profiles = []
        if hasattr(self, "supervisor"):
            profiles.append(self.PROFILES[self.SUPERVISOR_PROFILE])
        if hasattr(self, "driver"):
            profiles.append(self.PROFILES[self.DRIVER_PROFILE])
        return profiles or None


class Organization(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Supervisor(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.name


class Driver(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.name


class Vehicle(models.Model):
    model = models.CharField(max_length=50)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    licence_plate = models.CharField(max_length=10, unique=True)
    is_at_workshop = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.model} - {self.licence_plate}"


class Workshop(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Team(models.Model):
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return f"{self.name} - {self.type}"


class VehicleRegistry(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    vehicle_km = models.IntegerField()
    entry = models.BooleanField(default=False)  # foi entrada ou saída
    workshop = models.ForeignKey(Workshop, on_delete=models.CASCADE)
    problem_reported = models.CharField(max_length=256)
    responsable_team = models.ForeignKey(Team, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.problem_reported} - {self.vehicle.model}"
