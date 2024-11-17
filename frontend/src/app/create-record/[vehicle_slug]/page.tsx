"use client";

import { useGetTeams, useGetVehicle } from "@/hooks/react-query";
import { PageProps } from "../../../../.next/types/app/page";
import SearchableSelect from "@/components/searchable-select";

export default function CreateRecordPage({ params }: PageProps) {
  const { data: vehicle } = useGetVehicle(params.vehicle_slug);
  const { data: teams } = useGetTeams();

  return (
    <main className="container mx-auto">
      <h1>Modelo: {vehicle?.model}</h1>
      <h1>Placa: {vehicle?.licence_plate}</h1>
      <h1>
        Na oficina:&nbsp;
        <strong
          className={
            vehicle?.is_at_workshop ? "text-green-700" : "text-red-600"
          }
        >
          {vehicle?.is_at_workshop ? "sim" : "não"}
        </strong>
      </h1>

      {teams && (
        <SearchableSelect options={teams} placeholder="Select a team" />
      )}
    </main>
  );
}
