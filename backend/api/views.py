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
)
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import get_object_or_404
from api.serializers import VehicleHistoryReturnSerializer
from datetime import datetime


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
    filter_at_workshop_status = request.query_params.get("filter_at_workshop_status")
    if filter_at_workshop_status is not None:
        # here filter_at_workshop_status is either 'true' or 'false'
        filter_at_workshop_status = filter_at_workshop_status == "true"

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

        if (
            search_query
            and not (
                search_query in v.licence_plate.lower()
                or search_query in v.model.lower()
                or (
                    latest_entry.workshop
                    and search_query in latest_entry.workshop.name.lower()
                )
            )
        ) or (
            filter_at_workshop_status != None
            and latest_entry.vehicle.is_at_workshop != filter_at_workshop_status
        ):
            continue

        vehicle_registries.append(latest_entry)

    page_size = request.GET.get("per_page", 5)
    paginator = Paginator(vehicle_registries, page_size)
    page_number = request.GET.get("page", 1)
    try:
        page_obj = paginator.page(page_number)
    except PageNotAnInteger:
        page_obj = paginator.page(1)
    except EmptyPage:
        page_obj = paginator.page(paginator.num_pages)

    serializer = VehicleEntryRegistrySerializer(page_obj.object_list, many=True)

    return Response(
        {
            "count": paginator.count,
            "next": page_obj.next_page_number() if page_obj.has_next() else None,
            "previous": (
                page_obj.previous_page_number() if page_obj.has_previous() else None
            ),
            "num_pages": paginator.num_pages,
            "results": serializer.data,
        }
    )


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
    vehicle = get_object_or_404(Vehicle, slug=slug)

    history = (
        VehicleEntryRegistry.objects.filter(vehicle=vehicle)
        .exclude_created_by_system()
        .order_by("-created_at")
    )

    serializer = VehicleHistoryReturnSerializer(
        {
            "vehicle": vehicle,
            "history": history,
        }
    )

    return Response(serializer.data)


@api_view(http_method_names=["get"])
@permission_classes([IsAuthenticated])
def vehicle_history_csv_view(request: Request, vehicle_id: str):
    import csv
    import tempfile
    from django.http import FileResponse

    vehicle = get_object_or_404(Vehicle, id=vehicle_id)

    history = (
        VehicleEntryRegistry.objects.filter(vehicle=vehicle)
        .exclude_created_by_system()
        .order_by("-created_at")
    )

    serializer = VehicleHistoryReturnSerializer(
        {
            "vehicle": vehicle,
            "history": history,
        }
    )

    data = [
        [
            "Quilometragem",
            "Oficina",
            "Eq. Responsável",
            "Problema",
            "Autor",
            "Status",
            "Observação",
            "Entrou",
            "Saiu",
        ],
    ]

    for e in serializer.data["history"]:
        data.append(
            [
                e["vehicle_km"],
                e["workshop"]["name"],
                e["responsible_team"]["name"],
                e["problem_reported"],
                e["author"]["name"],
                e["status"],
                e["observation"],
                datetime.fromisoformat(e["created_at"]).strftime("%d/%m/%Y %H:%M"),
                (
                    datetime.fromisoformat(e["exit_record"]["created_at"]).strftime(
                        "%d/%m/%Y %H:%M"
                    )
                    if e["exit_record"]
                    else ""
                ),
            ]
        )

    # Create a temporary file to store the CSV data
    with tempfile.NamedTemporaryFile(
        mode="w+", delete=False, newline="", suffix=".csv"
    ) as temp_file:
        writer = csv.writer(temp_file)
        for row in data:
            writer.writerow(row)
        temp_file_path = temp_file.name

    # Open the file in binary mode and return it as a FileResponse
    response = FileResponse(open(temp_file_path, "rb"), content_type="text/csv")

    filename = f"{vehicle.model}_histórico.csv"
    response["Content-Disposition"] = f'attachment; filename="{filename}"'

    return response


class TeamViewset(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

    def get_queryset(self):
        user = self.request.user
        user_organization = (
            user.supervisor.organization
            if hasattr(user, "supervisor")
            else user.driver.organization
        )
        return Team.objects.filter(organization=user_organization)


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
def get_last_entry_record_from_vehicle_view(request, vehicle_slug: str):
    from api.serializers import VehicleDetailEntrySerializer

    vehicle = Vehicle.objects.get(slug=vehicle_slug)
    serializer = VehicleDetailEntrySerializer(instance=vehicle.get_last_entry_record())

    return Response(serializer.data)
