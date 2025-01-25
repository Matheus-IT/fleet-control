"use client";

import { useGetVehicleHistory } from "@/hooks/react-query";
import { VehicleEntryStatus } from "@/types/api";
import { Spinner } from "@heroui/react";

export default function CreateRecordPage({
  params,
}: {
  params: { vehicle_slug: string };
}) {
  const { data: historyData } = useGetVehicleHistory(params.vehicle_slug);

  function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  function formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  if (!historyData)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  return (
    <main className="container mx-auto mt-6">
      <h1 className="text-lg mb-2">Histórico do {historyData.vehicle.model}</h1>
      <div className="flex flex-col gap-4">
        {historyData.history.map((e) => (
          <div
            key={e.created_at.toString()}
            className="w-full shadow-md rounded-lg p-4 border-l-5 border-l-purple-700 cursor-pointer hover:border-l-purple-800 hover:shadow-lg"
          >
            <p className="text-base">Quilometragem: {e.vehicle_km}</p>

            <p className="text-base">Oficina: {e.workshop!.name}</p>

            <p className="text-base">
              Equipe responsável: {e.responsable_team.name}
            </p>

            <p className="text-base">Problema: {e.problem_reported}</p>

            <p className="text-base">Autor: {e.author.name}</p>

            <p className="text-base">
              Status:{" "}
              {e.status == VehicleEntryStatus.WAITING_APPROVAL && (
                <span className="text-orange-500">Aguardando aprovação</span>
              )}
              {e.status == VehicleEntryStatus.APPROVED && (
                <span className="text-green-500">Aprovado</span>
              )}
              {e.status == VehicleEntryStatus.NOT_APPROVED && (
                <span className="text-danger-500">Não aprovado</span>
              )}
            </p>

            {e.status == VehicleEntryStatus.NOT_APPROVED && (
              <p className="text-base">Motivo: {e.observation}</p>
            )}

            <p className="text-base">
              <strong>Entrou</strong> na oficina em: {formatDate(e.created_at)}{" "}
              as {formatTime(e.created_at)}
            </p>

            {e.exit_record && (
              <p>
                <strong>Saiu</strong> da oficina em{" "}
                {formatDate(e.exit_record.created_at)} as{" "}
                {formatTime(e.exit_record.created_at)}
              </p>
            )}
          </div>
        ))}

        {historyData.history.length == 0 && (
          <h1 className="text-lg">
            Não há histórico para esse veiculo ainda...
          </h1>
        )}
      </div>
    </main>
  );
}
