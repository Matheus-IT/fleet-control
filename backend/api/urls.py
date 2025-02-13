from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from api.views import (
    vehicles_overview_view,
    profile_info_view,
    TeamViewset,
    VehicleViewset,
    WorkshopViewset,
    VehicleEntryRegistryViewSet,
    create_vehicle_exit_record_view,
    vehicle_history_view,
    vehicle_history_csv_view,
    get_last_entry_record_from_vehicle_view,
)

from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register("vehicles", VehicleViewset, basename="vehicle")
router.register("teams", TeamViewset, basename="team")
router.register("workshops", WorkshopViewset, basename="workshop")
router.register(
    "vehicle-entry-registries",
    VehicleEntryRegistryViewSet,
    basename="vehicle-entry-registry",
)


urlpatterns = [
    path(
        "vehicle-overview/",
        vehicles_overview_view,
        name="vehicle_overview_view",
    ),
    path(
        "vehicle-history/<str:slug>/",
        vehicle_history_view,
        name="vehicle_history_view",
    ),
    path(
        "vehicle-history-csv/<str:vehicle_id>/",
        vehicle_history_csv_view,
        name="vehicle_history_csv_view",
    ),
    path(
        "get-last-entry-record-from-vehicle/<str:vehicle_slug>/",
        get_last_entry_record_from_vehicle_view,
        name="get_last_entry_record_from_vehicle_view",
    ),
    path("profile-info/", profile_info_view, name="profile_info_view"),
    path(
        "create-vehicle-exit-record/",
        create_vehicle_exit_record_view,
        name="create_vehicle_exit_record",
    ),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include(router.urls)),
]
