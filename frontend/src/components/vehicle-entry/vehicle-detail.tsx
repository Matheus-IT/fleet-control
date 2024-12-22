import {
  approveEntryRequest,
  getLastEntryRecordFromVehicle,
} from "@/api/request-queries";
import { Vehicle } from "@/types/api";
import { Button, Spinner } from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDate, formatTime } from "../../../utils/date-time";
import { useRouter } from "next/navigation";

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

  return (
    <main className="container mx-auto pt-4 max-sm:px-4">
      {lastEntryData && !isPending && (
        <>
          <p>Modelo: {vehicle.model}</p>

          <p>Placa: {vehicle.licence_plate}</p>

          <p className="text-base">
            Na oficina:{" "}
            <strong
              className={
                vehicle.is_at_workshop ? "text-green-700" : "text-red-600"
              }
            >
              {vehicle.is_at_workshop ? "sim" : "não"}
            </strong>
          </p>
          {vehicle.is_at_workshop && (
            <>
              <p className="text-base">
                Problema: {lastEntryData.problem_reported}
              </p>
              {lastEntryData.workshop && (
                <p className="text-base">
                  Oficina: {lastEntryData.workshop.name}
                </p>
              )}
            </>
          )}

          <p className="text-sm">
            {lastEntryData.author ? (
              <>
                Ultima atualização em{" "}
                <strong>{formatDate(lastEntryData.created_at)}</strong> as{" "}
                {formatTime(lastEntryData.created_at)} por{" "}
                <strong>{lastEntryData.author.name}</strong>
              </>
            ) : (
              <>
                Registro do veículo criado em{" "}
                <strong>{formatDate(lastEntryData.created_at)}</strong> as{" "}
                {formatTime(lastEntryData.created_at)}
              </>
            )}
          </p>

          <Button color="primary" onClick={handleGoToHistory}>
            Ver histórico
          </Button>

          {!vehicle.can_enter_workshop && (
            <>
              <h1 className="text-lg">Aguardando aprovação</h1>
              <Button color="success" onClick={handleApprove}>
                Aprovar
              </Button>
              <Button color="danger">Não aprovar</Button>
            </>
          )}
        </>
      )}

      {isPending && (
        <div className="h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
    </main>
  );
}
