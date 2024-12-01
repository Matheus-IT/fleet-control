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
    path("profile-info/", profile_info_view, name="profile_info_view"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include(router.urls)),
]
