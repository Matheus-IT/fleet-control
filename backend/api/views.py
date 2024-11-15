from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from api.models import Vehicle, VehicleEntryRegistry
from api.serializers import VehicleEntryRegistrySerializer


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
            continue

        # Skip if no matching search terms
        if search_query and not (
            search_query in v.licence_plate.lower()
            or search_query in v.model.lower()
            or search_query in latest_entry.workshop.name.lower()
        ):
            continue

        vehicle_registries.append(latest_entry)
    print("4")

    serializer = VehicleEntryRegistrySerializer(vehicle_registries, many=True)

    return Response(serializer.data)


@api_view(http_method_names=["get"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def profile_info_view(request: Request):
    return Response({"user_profiles": request.user.profiles})
