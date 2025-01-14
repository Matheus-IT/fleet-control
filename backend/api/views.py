from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from api.models import (
    Vehicle,
    VehicleEntryRegistry,
    Team,
    Workshop,
)
from api.serializers import (
    VehicleEntryRegistrySerializer,
    VehicleSerializer,
    TeamSerializer,
    WorkshopSerializer,
    VehicleEntrySerializer,
    VehicleExitSerializer,
)


@api_view(http_method_names=["get"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def vehicles_overview_view(request: Request):
    if not hasattr(request.user, "supervisor") and not hasattr(request.user, "driver"):
        return Response(
            {
                "error": "Usuário precisa ser um supervisor ou motorista para acessar essa página"
            },
            status=400,
        )

    search_query = request.query_params.get("search_query", "")
    # case insensitive
    search_query = search_query.strip().lower()

    organization = (
        request.user.supervisor.organization
        if hasattr(request.user, "supervisor")
        else request.user.driver.organization
    )
    vehicles = Vehicle.objects.filter(organization=organization)
    vehicle_registries = []
    for v in vehicles:
        latest_entry = VehicleEntryRegistry.objects.filter(vehicle=v).last()
        if not latest_entry:
            # Create entry to be able to show up in the list
            latest_entry = VehicleEntryRegistry.objects.create(
                vehicle=v,
                problem_reported="",
                status=VehicleEntryRegistry.StatusChoices.APPROVED.value,
            )

        # Skip if no matching search terms
        if search_query and not (
            search_query in v.licence_plate.lower()
            or search_query in v.model.lower()
            or search_query in latest_entry.workshop.name.lower()
        ):
            continue

        vehicle_registries.append(latest_entry)

    serializer = VehicleEntryRegistrySerializer(vehicle_registries, many=True)

    return Response(serializer.data)


@api_view(http_method_names=["get"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def profile_info_view(request: Request):
    return Response(
        {
            "id": request.user.id,
            "user_name": request.user.name,
            "user_profiles": request.user.profiles,
        }
    )


class VehicleViewset(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    lookup_field = "slug"


@api_view(http_method_names=["get"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def vehicle_history_view(request: Request, slug: str):
    from django.shortcuts import get_object_or_404
    from api.serializers import VehicleHistoryReturnSerializer

    print("\n>>>", slug)
    vehicle = get_object_or_404(Vehicle, slug=slug)

    history = (
        VehicleEntryRegistry.objects.filter(vehicle=vehicle)
        .exclude_created_by_system()
        .order_by("-created_at")
    )
    print("history", history)

    serializer = VehicleHistoryReturnSerializer(
        {
            "vehicle": vehicle,
            "history": history,
        }
    )

    return Response(serializer.data)


class TeamViewset(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class WorkshopViewset(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Workshop.objects.all()
    serializer_class = WorkshopSerializer


class VehicleEntryRegistryViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = VehicleEntryRegistry.objects.all()
    serializer_class = VehicleEntrySerializer


@api_view(http_method_names=["post"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def create_vehicle_exit_record_view(request: Request):
    from api.serializers import VehicleExitCreateSerializer

    vehicle_id = request.data.get("vehicle_id")

    entry_record = VehicleEntryRegistry.objects.filter(vehicle_id=vehicle_id).last()
    if not entry_record:
        return Response(
            {"error": "Corresponding vehicle entry not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    payload = {
        "author": request.user.id,
        "entry_record": entry_record.id,
    }
    serializer = VehicleExitCreateSerializer(data=payload)
    if serializer.is_valid():
        created = serializer.save()
        return_serializer = VehicleExitCreateSerializer(instance=created)
        return Response(return_serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(http_method_names=["get"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def get_last_entry_record_from_vehicle_view(request, vehicle_id: int):
    from api.serializers import VehicleDetailEntrySerializer

    vehicle = Vehicle.objects.get(id=vehicle_id)
    serializer = VehicleDetailEntrySerializer(instance=vehicle.get_last_entry_record())

    return Response(serializer.data)
