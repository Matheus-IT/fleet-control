"use client";

import { PageProps } from "../../../../../.next/types/app/page";
import { useGetVehicleHistory } from "@/hooks/react-query";
import { Spinner } from "@nextui-org/react";

export default function CreateRecordPage({ params }: PageProps) {
  const { data: historyData } = useGetVehicleHistory(params.vehicle_slug);

  if (!historyData)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  console.log("historyData", historyData);

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

  return (
    <main className="container mx-auto mt-6">
      <h1 className="text-lg mb-2">Histórico do {historyData.vehicle.model}</h1>
      <div className="flex flex-col gap-4">
        {historyData.history.map((e) => (
          <div
            key={e.created_at.toString()}
            className="w-full shadow-md rounded-lg p-4 border-l-5 border-l-green-700 cursor-pointer hover:border-l-green-800 hover:shadow-lg"
          >
            <p className="text-base">Quilometragem: {e.vehicle_km}</p>
            <p className="text-base">Oficina: {e.workshop!.name}</p>
            <p className="text-base">
              Time responsável: {e.responsable_team.name}
            </p>
            <p className="text-base">Problema: {e.problem_reported}</p>
            <p className="text-base">Autor: {e.author.name}</p>
            <p className="text-base">
              Criado em: <strong>{formatDate(e.created_at)}</strong> as{" "}
              {formatTime(e.created_at)}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
