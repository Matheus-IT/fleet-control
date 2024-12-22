import React from "react";
import {
  approveEntryRequest,
  getLastEntryRecordFromVehicle,
} from "@/api/request-queries";
import { Vehicle } from "@/types/api";
import {
  Button,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
} from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDate, formatTime } from "../../../utils/date-time";
import { useRouter } from "next/navigation";
import { Clock, Car, Wrench, AlertTriangle } from "lucide-react";

export default function VehicleDetail({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter();
  const { data: lastEntryData, isPending } = useQuery({
    queryFn: () => getLastEntryRecordFromVehicle(vehicle),
    queryKey: ["getLastEntryRecordFromVehicle"],
  });

  const mutation = useMutation({
    mutationFn: () => approveEntryRequest(lastEntryData!.id),
    onSettled: () => {
      window.location.reload();
    },
  });

  function handleGoToHistory() {
    router.push(`/vehicle-history/${vehicle.slug}`);
  }

  function handleApprove() {
    mutation.mutate();
  }

  if (isPending) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!lastEntryData) {
    return null;
  }

  return (
    <main className="container mx-auto py-6 px-4 max-w-3xl">
      <Card className="w-full">
        <CardHeader className="flex gap-3">
          <Car className="w-6 h-6" />
          <div className="flex flex-col">
            <p className="text-xl font-bold">{vehicle.model}</p>
            <p className="text-small text-default-500">
              Placa: {vehicle.licence_plate}
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              <span className="text-base">
                Na oficina:{" "}
                <strong
                  className={
                    vehicle.is_at_workshop
                      ? "text-green-700 bg-green-100 px-2 py-1 rounded"
                      : "text-red-600 bg-red-100 px-2 py-1 rounded"
                  }
                >
                  {vehicle.is_at_workshop ? "Sim" : "Não"}
                </strong>
              </span>
            </div>

            {vehicle.is_at_workshop && (
              <div className="space-y-2 pl-7">
                <p className="text-base">
                  <span className="text-gray-600">Problema reportado:</span>{" "}
                  <strong>{lastEntryData.problem_reported}</strong>
                </p>
                {lastEntryData.workshop && (
                  <p className="text-base">
                    <span className="text-gray-600">Oficina:</span>{" "}
                    <strong>{lastEntryData.workshop.name}</strong>
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {lastEntryData.author ? (
                <p>
                  Ultima atualização em{" "}
                  <strong>{formatDate(lastEntryData.created_at)}</strong> às{" "}
                  {formatTime(lastEntryData.created_at)} por{" "}
                  <strong>{lastEntryData.author.name}</strong>
                </p>
              ) : (
                <p>
                  Registro do veículo criado em{" "}
                  <strong>{formatDate(lastEntryData.created_at)}</strong> às{" "}
                  {formatTime(lastEntryData.created_at)}
                </p>
              )}
            </div>
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-between">
          <Button color="primary" onClick={handleGoToHistory}>
            Ver histórico
          </Button>

          {!vehicle.can_enter_workshop && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <Button color="success" onClick={handleApprove}>
                Aprovar
              </Button>
              <Button color="danger">Não aprovar</Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}
