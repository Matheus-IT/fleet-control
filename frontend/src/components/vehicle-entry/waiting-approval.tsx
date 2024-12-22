import { getLastEntryRecordFromVehicle } from "@/api/request-queries";
import { Vehicle } from "@/types/api";
import { Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function WaitingApproval({ vehicle }: { vehicle: Vehicle }) {
  const {
    data: lastEntryData,
    error,
    isPending,
  } = useQuery({
    queryFn: () => getLastEntryRecordFromVehicle(vehicle),
    queryKey: ["getLastEntryRecordFromVehicle"],
  });

  useEffect(() => {
    console.log("data", lastEntryData);
    console.log("error", error);
  }, [lastEntryData, error]);

  return (
    <main className="container mx-auto pt-4 max-sm:px-4">
      {lastEntryData && !isPending && (
        <>
          <h1>Modelo: {vehicle.model}</h1>
          <h1>Placa: {vehicle.licence_plate}</h1>
          <h1>Problema: {lastEntryData.problem_reported}</h1>
          <h1>Oficina: {lastEntryData.workshop!.name}</h1>
          <h1>Autor: {lastEntryData.author!.name}</h1>
          <h1 className="text-orange-500">Aguardando aprovação</h1>
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
