import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import SearchableSelect from "@/components/searchable-select";
import { Button, Input, Spinner } from "@nextui-org/react";
import { Plus, Trash2 } from "lucide-react";
import {
  useCreateRecordMutation,
  useGetTeams,
  useGetWorkshops,
} from "@/hooks/react-query";
import { ResponsableTeam, Vehicle, Workshop } from "@/types/api";
import { useUserInfoStore } from "@/stores/user-info";

export function CreateVehicleEntryRecord({ vehicle }: { vehicle: Vehicle }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      vehicleParts: [{ name: "", quantity: "1", unitValue: "0" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vehicleParts",
  });

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

  // Watch all vehicle parts to calculate total
  const vehicleParts = watch("vehicleParts");
  const total = vehicleParts.reduce((sum, part) => {
    const quantity = parseFloat(part.quantity) || 0;
    const unitValue = parseFloat(part.unitValue) || 0;
    return sum + quantity * unitValue;
  }, 0);

  async function onSubmit(formData: any) {
    try {
      await mutation.mutateAsync({
        vehicle: vehicle.id,
        vehicle_km: parseInt(formData.kilometer),
        workshop: selectedWorkshop!.id,
        problem_reported: formData.problem_reported,
        responsable_team: selectedTeam!.id,
        author: userInfo!.id,
        vehicle_parts: formData.vehicleParts.map((part) => ({
          ...part,
          quantity: parseInt(part.quantity),
          unitValue: parseFloat(part.unitValue),
        })),
      });

      window.location.reload();
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
    <main className="container mx-auto pt-4 max-sm:px-4">
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Quilometragem (km):"
          size="sm"
          {...register("kilometer", { required: true })}
        />
        {errors.kilometer && (
          <p className="text-red-500">Quilometragem é obrigatória.</p>
        )}

        <Input
          label="Problema relatado:"
          size="sm"
          {...register("problem_reported", { required: true })}
        />
        {errors.problem_reported && (
          <p className="text-red-500">Problema relatado é obrigatório.</p>
        )}

        <SearchableSelect
          options={teams}
          placeholder="Selecione uma equipe"
          getOptionLabel={(option: ResponsableTeam) =>
            `${option.name} - ${option.type}`
          }
          getOptionValue={(option: ResponsableTeam) => option.id.toString()}
          onChange={(option: ResponsableTeam) => setSelectedTeam(option)}
        />

        <SearchableSelect
          options={workshops}
          placeholder="Selecione uma oficina"
          getOptionLabel={(option: Workshop) => option.name}
          getOptionValue={(option: Workshop) => option.id.toString()}
          onChange={(option: Workshop) => setSelectedWorkshop(option)}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Peças do Veículo</h2>
            <Button
              size="sm"
              color="primary"
              isIconOnly
              disabled={fields.length >= 10}
              onClick={() =>
                append({ name: "", quantity: "1", unitValue: "0" })
              }
              type="button"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <Input
                label="Nome da Peça"
                size="sm"
                className="flex-1"
                {...register(`vehicleParts.${index}.name`, { required: true })}
              />
              <Input
                label="Quantidade"
                size="sm"
                type="number"
                className="w-24"
                {...register(`vehicleParts.${index}.quantity`, {
                  required: true,
                  min: 1,
                })}
              />
              <Input
                label="Valor Unitário"
                size="sm"
                type="number"
                step="0.01"
                className="w-32"
                {...register(`vehicleParts.${index}.unitValue`, {
                  required: true,
                  min: 0,
                })}
              />
              <Button
                size="sm"
                color="danger"
                isIconOnly
                className="mt-1"
                onClick={() => remove(index)}
                type="button"
                disabled={fields.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {fields.length > 0 && (
            <div className="flex justify-end pt-2">
              <p className="text-lg font-semibold">
                Total: R$ {total.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        <Button color="primary" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Confirmar"}
        </Button>
      </form>

      {mutation.isError && (
        <div className="text-red-500 mt-4">
          Falha ao submeter formulário: {mutation.error.message}
        </div>
      )}
    </main>
  );
}

export default CreateVehicleEntryRecord;
