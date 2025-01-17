from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
    User,
)
from django.utils.translation import gettext_lazy as _
from django.db import models
from uuid import uuid4


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
    slug = models.SlugField(unique=True, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:  # Ensure the slug is created if not provided
            self.slug = uuid4()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.model} - {self.licence_plate}"

    @property
    def is_at_workshop(self):
        latest_entry = self.get_last_entry_record()
        if not latest_entry:
            return False

        if hasattr(latest_entry, "exit_record"):
            return False

        if (not hasattr(latest_entry, "exit_record")) and latest_entry.author == None:
            # if the record doesn't have author, it is the creation of the vehicle
            return False

        return True

    @property
    def can_enter_workshop(self):
        latest_entry = self.get_last_entry_record()
        return latest_entry.status == VehicleEntryRegistry.StatusChoices.APPROVED

    def get_last_entry_record(self):
        """Return last entry record as a django orm object"""
        return VehicleEntryRegistry.objects.filter(vehicle=self).last()


class Workshop(models.Model):
    name = models.CharField(max_length=50, unique=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Team(models.Model):
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=50, unique=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} - {self.type}"


class VehicleEntryRegistryQuerySet(models.QuerySet):
    def exclude_created_by_system(self):
        return self.exclude(author=None)


class VehicleEntryRegistryManager(models.Manager):
    def get_queryset(self):
        return VehicleEntryRegistryQuerySet(self.model, using=self._db)


class VehicleEntryRegistry(models.Model):
    class StatusChoices(models.TextChoices):
        APPROVED = "Aprovado"
        NOT_APPROVED = "Não aprovado"
        WAITING_APPROVAL = "Aguardando aprovação"

    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    vehicle_km = models.IntegerField(null=True)
    workshop = models.ForeignKey(Workshop, on_delete=models.CASCADE, null=True)
    problem_reported = models.CharField(max_length=256)
    responsable_team = models.ForeignKey(Team, on_delete=models.CASCADE, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=StatusChoices.choices)
    observation = models.CharField(max_length=100, default="", blank=True)

    objects = VehicleEntryRegistryManager()

    def __str__(self):
        return f"{self.problem_reported} - {self.vehicle.model}"


class VehiclePart(models.Model):
    entry = models.ForeignKey(
        VehicleEntryRegistry, related_name="parts", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=50)
    quantity = models.IntegerField()
    unit_value = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.name} ({self.quantity}x) - R${self.unit_value}"


class VehicleExitRegistry(models.Model):
    entry_record = models.OneToOneField(
        VehicleEntryRegistry, related_name="exit_record", on_delete=models.CASCADE
    )
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Exit of {self.entry_record}"
