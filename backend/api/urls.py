from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from api.views import vehicles_overview_view, profile_info_view

urlpatterns = [
    path(
        "vehicle-overview/",
        vehicles_overview_view,
        name="vehicle_overview_view",
    ),
    path("profile-info/", profile_info_view, name="profile_info_view"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
