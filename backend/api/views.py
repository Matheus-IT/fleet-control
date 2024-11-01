from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


@api_view(http_method_names=["get"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def vehicle_entries_view(request: Request):
    vehicles = [
        {
            "state": "entregue",
            "licence_plate": "PTD2A39",
            "model": "FIAT/STRADA HD WK CC E 2020/2020",
            "description": "Serviço complementar referente a ID 456789 para trocar 2 pneus.",
            "author": "Fábio Santos",
            "date": "31/07/2024",
        },
        {
            "state": "entregue",
            "licence_plate": "PTD2632",
            "model": "FIAT/STRADA HD WK CC E 2020/2020",
            "description": "Revisão preventiva: troca de óleo.",
            "author": "André silva",
            "date": "29/07/2024",
        },
    ]
    return Response(vehicles)
