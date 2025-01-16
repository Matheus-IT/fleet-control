from rest_framework import serializers
from .models import (
    Vehicle,
    VehicleEntryRegistry,
    VehiclePart,
    VehicleExitRegistry,
    Workshop,
    User,
    Team,
)


class VehicleSerializer(serializers.ModelSerializer):
    is_at_workshop = serializers.SerializerMethodField()
    can_enter_workshop = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = [
            "id",
            "model",
            "organization",
            "licence_plate",
            "slug",
            "is_at_workshop",
            "can_enter_workshop",
        ]

    def get_is_at_workshop(self, obj):
        return obj.is_at_workshop

    def get_can_enter_workshop(self, obj):
        return obj.can_enter_workshop


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


class VehiclePartSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehiclePart
        fields = ["name", "quantity", "unit_value"]


class VehicleEntryRegistrySerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer()
    workshop = WorkshopSerializer()
    responsable_team = TeamSerializer()
    author = serializers.SerializerMethodField()

    class Meta:
        model = VehicleEntryRegistry
        fields = [
            "id",
            "vehicle",
            "vehicle_km",
            "workshop",
            "problem_reported",
            "responsable_team",
            "author",
            "created_at",
            "status",
            "observation",
        ]

    def get_author(self, obj):
        if obj.author:
            return {"name": obj.author.name}
        return None


class VehicleDetailEntrySerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer()
    workshop = WorkshopSerializer()
    responsable_team = TeamSerializer()
    author = serializers.SerializerMethodField()
    parts = VehiclePartSerializer(many=True)

    class Meta:
        model = VehicleEntryRegistry
        fields = [
            "id",
            "vehicle",
            "vehicle_km",
            "workshop",
            "problem_reported",
            "responsable_team",
            "author",
            "parts",
            "created_at",
            "status",
            "observation",
        ]

    def get_author(self, obj):
        if obj.author:
            return {"name": obj.author.name}
        return None


class VehicleEntrySerializer(serializers.ModelSerializer):
    parts = VehiclePartSerializer(many=True)

    class Meta:
        model = VehicleEntryRegistry
        fields = [
            "vehicle",
            "vehicle_km",
            "workshop",
            "problem_reported",
            "responsable_team",
            "author",
            "parts",
            "created_at",
            "status",
            "observation",
        ]

    def create(self, validated_data):
        parts_data = validated_data.pop("parts", [])
        entry = VehicleEntryRegistry.objects.create(**validated_data)

        for part_data in parts_data:
            VehiclePart.objects.create(entry=entry, **part_data)

        return entry

    def update(self, instance, validated_data):
        parts_data = validated_data.pop("parts", [])

        # Update the main entry
        print("validated_data", validated_data.items())
        for attr, value in validated_data.items():
            print("instance", instance, "attr", attr, "value", value)
            setattr(instance, attr, value)
        instance.save()

        # Handle parts update
        if parts_data:
            instance.parts.all().delete()  # Remove existing parts
            for part_data in parts_data:
                VehiclePart.objects.create(entry=instance, **part_data)

        return instance


class VehicleExitSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = VehicleExitRegistry
        fields = [
            "entry_record",
            "author",
            "created_at",
        ]

    def get_author(self, obj):
        if obj.author:
            return {"name": obj.author.name}
        return None


class VehicleExitCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleExitRegistry
        fields = [
            "entry_record",
            "author",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class VehicleHistorySerializer(serializers.ModelSerializer):
    workshop = WorkshopSerializer()
    responsable_team = TeamSerializer()
    author = serializers.SerializerMethodField()
    exit_record = VehicleExitSerializer()

    class Meta:
        model = VehicleEntryRegistry
        fields = [
            "exit_record",
            "vehicle_km",
            "workshop",
            "problem_reported",
            "responsable_team",
            "author",
            "status",
            "observation",
            "created_at",
        ]

    def get_author(self, obj):
        if obj.author:
            return {"name": obj.author.name}
        return None


class VehicleHistoryReturnSerializer(serializers.Serializer):
    vehicle = VehicleSerializer()
    history = serializers.ListField(child=VehicleHistorySerializer())
