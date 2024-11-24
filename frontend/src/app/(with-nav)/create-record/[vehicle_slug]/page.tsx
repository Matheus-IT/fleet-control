"use client";

import {
  useGetTeams,
  useGetVehicle,
  useGetWorkshops,
} from "@/hooks/react-query";
import { PageProps } from "../../../../../.next/types/app/page";
import SearchableSelect from "@/components/searchable-select";
import { ResponsableTeam, Workshop } from "@/types/api";
import { useState } from "react";
import { Button, Input } from "@nextui-org/react";

export default function CreateRecordPage({ params }: PageProps) {
  const { data: vehicle } = useGetVehicle(params.vehicle_slug);
  const { data: teams } = useGetTeams();
  const { data: workshops } = useGetWorkshops();
  const [selectedTeam, setSelectedTeam] = useState<ResponsableTeam | null>(
    null
  );
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(
    null
  );

  return (
    <main className="container mx-auto pt-4">
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
      <Input label="Quilometragem (km):" size="sm" className="mb-4" />
      <Input label="Problema relatado:" size="sm" className="mb-4" />

      {teams && (
        <SearchableSelect
          options={teams}
          placeholder="Selecione uma equipe"
          className="mb-3"
          getOptionLabel={(option: ResponsableTeam) =>
            `${option.name} - ${option.type}`
          }
          getOptionValue={(option: ResponsableTeam) => option.id.toString()}
          onChange={(option: ResponsableTeam) => setSelectedTeam(option)}
        />
      )}

      {workshops && (
        <SearchableSelect
          options={workshops}
          placeholder="Selecione uma oficina"
          className="mb-3"
          getOptionLabel={(option: Workshop) => option.name}
          getOptionValue={(option: Workshop) => option.id.toString()}
          onChange={(option: Workshop) => setSelectedWorkshop(option)}
        />
      )}

      <Button color="primary">Confirmar</Button>
    </main>
  );
}
