import SearchableSelect from "@/components/searchable-select";
import { Button, Input, Spinner } from "@nextui-org/react";
import {
  useCreateRecordMutation,
  useGetTeams,
  useGetWorkshops,
} from "@/hooks/react-query";
import { useForm } from "react-hook-form";
import { ResponsableTeam, Vehicle, Workshop } from "@/types/api";
import { useState } from "react";
import { useUserInfoStore } from "@/stores/user-info";

export function CreateVehicleEntryRecord({ vehicle }: { vehicle: Vehicle }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const mutation = useCreateRecordMutation();

  const { data: teams } = useGetTeams();
  const { data: workshops } = useGetWorkshops();
  const [selectedTeam, setSelectedTeam] = useState<ResponsableTeam | null>(
    null
  );
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(
    null
  );
  const { userInfo } = useUserInfoStore((state) => state);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(formData: any) {
    console.log("formData", formData);

    try {
      await mutation.mutateAsync({
        vehicle: vehicle.id,
        vehicle_km: parseInt(formData.kilometer),
        workshop: selectedWorkshop!.id,
        problem_reported: formData.problem_reported,
        responsable_team: selectedTeam!.id,
        author: userInfo!.id,
      });
    } catch (error) {
      console.error("Failed to submit record:", error);
    }
  }

  if (!teams || !workshops)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Quilometragem (km):"
          size="sm"
          className="mb-4"
          {...register("kilometer", { required: true })}
        />
        {errors.kilometer && <p>Quilometragem é obrigatória.</p>}

        <Input
          label="Problema relatado:"
          size="sm"
          className="mb-4"
          {...register("problem_reported", { required: true })}
        />
        {errors.problem_reported && <p>Problema relatado é obrigatório.</p>}

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

        <SearchableSelect
          options={workshops}
          placeholder="Selecione uma oficina"
          className="mb-3"
          getOptionLabel={(option: Workshop) => option.name}
          getOptionValue={(option: Workshop) => option.id.toString()}
          onChange={(option: Workshop) => setSelectedWorkshop(option)}
        />

        <Button color="primary" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Confirmar"}
        </Button>
      </form>

      {mutation.isError && (
        <div style={{ color: "red", marginTop: "10px" }}>
          Falha ao submeter formulário: {mutation.error.message}
        </div>
      )}
    </main>
  );
}
