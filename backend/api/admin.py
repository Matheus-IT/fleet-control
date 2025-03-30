from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib import admin
from api.models import (
    User,
    Organization,
    Supervisor,
    Driver,
    Vehicle,
    Workshop,
    Team,
    VehicleEntryRegistry,
    VehiclePart,
    VehicleExitRegistry,
)
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError


class UserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
    password2 = forms.CharField(
        label="Password confirmation", widget=forms.PasswordInput
    )

    class Meta:
        model = User
        fields = ("email", "name")

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField()
    new_password1 = forms.CharField(
        label="New password", widget=forms.PasswordInput, required=False
    )
    new_password2 = forms.CharField(
        label="Confirm new password", widget=forms.PasswordInput, required=False
    )

    class Meta:
        model = User
        fields = ("email", "name", "password", "is_active", "is_staff")

    def clean_password(self):
        return self.initial["password"]

    def clean(self):
        cleaned_data = super().clean()
        new_password1 = cleaned_data.get("new_password1")
        new_password2 = cleaned_data.get("new_password2")

        if new_password1 or new_password2:
            if new_password1 != new_password2:
                raise forms.ValidationError("The two password fields must match.")

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        new_password = self.cleaned_data.get("new_password1")
        if new_password:
            user.set_password(new_password)
        if commit:
            user.save()
        return user


class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    list_display = ["id", "email", "name", "is_staff"]
    list_filter = ["email", "name", "is_staff", "is_active"]
    fieldsets = (
        (
            None,
            {"fields": ("email", "name", "password", "new_password1", "new_password2")},
        ),
        ("Permissions", {"fields": ("is_staff", "is_active")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "name",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_active",
                ),
            },
        ),
    )
    search_fields = ("email",)
    ordering = ("email",)


class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


class SupervisorAdmin(admin.ModelAdmin):
    list_display = ("id", "organization", "user")
    search_fields = ("organization", "user")


class DriverAdmin(admin.ModelAdmin):
    list_display = ("id", "organization", "user")
    search_fields = ("organization", "user")


class VehicleAdmin(admin.ModelAdmin):
    list_display = ("id", "model", "organization", "licence_plate", "is_at_workshop")
    search_fields = ("model", "organization", "licence_plate", "is_at_workshop")


class WorkshopAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
    )
    search_fields = ("name",)


class TeamAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "type")
    search_fields = ("name", "type")


class VehicleEntryRegistryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "vehicle",
        "vehicle_km",
        "workshop",
        "status",
        "problem_reported",
        "responsible_team",
        "created_at",
    )
    search_fields = (
        "vehicle",
        "vehicle_km",
        "workshop",
        "problem_reported",
        "responsible_team",
        "created_at",
    )


class VehiclePartAdmin(admin.ModelAdmin):
    list_display = ["id", "entry", "name", "quantity", "unit_value"]


class VehicleExitRegistryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "entry_record",
        "created_at",
    )
    search_fields = (
        "entry_record",
        "created_at",
    )


admin.site.register(User, UserAdmin)
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(Supervisor, SupervisorAdmin)
admin.site.register(Driver, DriverAdmin)
admin.site.register(Vehicle, VehicleAdmin)
admin.site.register(Workshop, WorkshopAdmin)
admin.site.register(Team, TeamAdmin)
admin.site.register(VehicleEntryRegistry, VehicleEntryRegistryAdmin)
admin.site.register(VehiclePart, VehiclePartAdmin)
admin.site.register(VehicleExitRegistry, VehicleExitRegistryAdmin)
