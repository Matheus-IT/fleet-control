from rest_framework import serializers
from .models import Vehicle, VehicleEntryRegistry, Workshop, User, Team


class VehicleSerializer(serializers.ModelSerializer):
    is_at_workshop = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = [
            "id",
            "model",
            "organization",
            "licence_plate",
            "slug",
            "is_at_workshop",
        ]

    def get_is_at_workshop(self, obj):
        return obj.is_at_workshop


class WorkshopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workshop
        fields = ["id", "name"]


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ["id", "name", "type"]
        read_only_fields = ["id"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "name",
            "email",
            "is_active",
            "is_staff",
            "profiles",
        ]


class VehicleEntryRegistrySerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer()
    workshop = WorkshopSerializer()
    responsable_team = TeamSerializer()
    author = serializers.SerializerMethodField()

    class Meta:
        model = VehicleEntryRegistry
        fields = [
            "vehicle",
            "vehicle_km",
            "workshop",
            "problem_reported",
            "responsable_team",
            "author",
            "created_at",
        ]

    def get_author(self, obj):
        if obj.author:
            return {"name": obj.author.name}
        return None


class VehicleEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleEntryRegistry
        fields = [
            "vehicle",
            "vehicle_km",
            "workshop",
            "problem_reported",
            "responsable_team",
            "author",
            "created_at",
        ]
