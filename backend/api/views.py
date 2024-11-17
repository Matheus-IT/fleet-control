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
from api.models import Vehicle, VehicleEntryRegistry, Team
from api.serializers import (
    VehicleEntryRegistrySerializer,
    VehicleSerializer,
    TeamSerializer,
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
        {"user_name": request.user.name, "user_profiles": request.user.profiles}
    )


class VehicleViewset(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    lookup_field = "slug"


class TeamViewset(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
