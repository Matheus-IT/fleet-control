import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SearchableSelect from "@/components/searchable-select";
import { Button, Input, Spinner } from "@nextui-org/react";
import { Plus, Trash2 } from "lucide-react";
import {
  useCreateRecordMutation,
  useGetTeams,
  useGetWorkshops,
} from "@/hooks/react-query";
import {
  ResponsableTeam,
  Vehicle,
  VehicleEntryRegistryChoices,
  Workshop,
} from "@/types/api";
import { useUserInfoStore } from "@/stores/user-info";
import { getLastEntryRecordFromVehicle } from "@/api/request-queries";
import { useQuery } from "@tanstack/react-query";

// Schema definitions
const vehiclePartSchema = z.object({
  name: z.string().min(1, "Nome da peça é obrigatório"),
  quantity: z.string().min(1, "Quantidade deve ser maior que 0"),
  unitValue: z.string().min(0, "Valor unitário deve ser maior ou igual a 0"),
});

const formSchema = z.object({
  vehicleParts: z
    .array(vehiclePartSchema)
    .min(1, "Pelo menos uma peça é obrigatória"),
  kilometer: z.string().min(1, "Quilometragem é obrigatória"),
  problem_reported: z.string().min(1, "Problema relatado é obrigatório"),
});

const errorSelectStyles = {
  borderColor: "#ef4444",
  "&:hover": {
    borderColor: "#ef4444",
  },
};

type FormSchema = z.infer<typeof formSchema>;

interface CreateVehicleEntryRecordProps {
  vehicle: Vehicle;
}

export function CreateVehicleEntryRecord({
  vehicle,
}: CreateVehicleEntryRecordProps) {
  const [selectedTeam, setSelectedTeam] = useState<ResponsableTeam | null>(
    null
  );
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(
    null
  );
  const [formError, setFormError] = useState<{
    team?: string;
    workshop?: string;
  }>({});
  const { userInfo } = useUserInfoStore();
  const { data: teams } = useGetTeams();
  const { data: workshops } = useGetWorkshops();
  const mutation = useCreateRecordMutation();
  const { data: lastEntryData } = useQuery({
    queryFn: () => getLastEntryRecordFromVehicle(vehicle),
    queryKey: ["getLastEntryRecordFromVehicle"],
  });
  const [kilometer, setKilometer] = useState("0");

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleParts: [{ name: "", quantity: "1", unitValue: "0" }],
      kilometer: "0",
      problem_reported: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vehicleParts",
  });

  useEffect(() => {
    if (lastEntryData?.vehicle_km) {
      setKilometer(lastEntryData.vehicle_km.toString());
    }
  }, [lastEntryData, reset, watch]);

  // Calculate total
  const vehicleParts = watch("vehicleParts");
  const total = vehicleParts.reduce((sum, part) => {
    const quantity = part.quantity;
    const unitValue = part.unitValue;
    return sum + parseInt(quantity) * parseFloat(unitValue);
  }, 0);

  const onSubmit = async (formData: FormSchema) => {
    // Reset previous errors
    setFormError({});

    console.log("selectedTeam", selectedTeam, selectedTeam ? true : false);
    console.log(
      "selectedWorkshop",
      selectedWorkshop,
      selectedWorkshop ? true : false
    );

    // Validate selects
    if (!selectedTeam) {
      setFormError((prev) => ({ ...prev, team: "Equipe é obrigatória" }));
    }
    if (!selectedWorkshop) {
      setFormError((prev) => ({ ...prev, workshop: "Oficina é obrigatória" }));
    }

    if (!userInfo || !selectedTeam || !selectedWorkshop) {
      return;
    }

    try {
      await mutation.mutateAsync({
        vehicle: vehicle.id,
        vehicle_km: parseInt(formData.kilometer),
        workshop: selectedWorkshop.id,
        problem_reported: formData.problem_reported,
        responsable_team: selectedTeam.id,
        author: userInfo.id,
        parts: formData.vehicleParts.map((part) => ({
          name: part.name,
          quantity: parseInt(part.quantity),
          unit_value: parseFloat(part.unitValue),
        })),
        status: VehicleEntryRegistryChoices.WAITING_APPROVAL,
      });

      window.location.reload();
    } catch (error) {
      console.error("Failed to submit record:", error);
    }
  };

  if (!teams || !workshops) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

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
        <div>
          <Input
            label="Quilometragem (km):"
            size="sm"
            {...register("kilometer")}
            value={kilometer}
            isInvalid={!!errors.kilometer}
            errorMessage={errors.kilometer?.message}
          />
        </div>

        <div>
          <Input
            label="Problema relatado:"
            size="sm"
            {...register("problem_reported")}
            isInvalid={!!errors.problem_reported}
            errorMessage={errors.problem_reported?.message}
          />
        </div>

        <SearchableSelect
          options={teams}
          placeholder="Selecione uma equipe"
          getOptionLabel={(option: ResponsableTeam) =>
            `${option.name} - ${option.type}`
          }
          getOptionValue={(option: ResponsableTeam) => option.id.toString()}
          onChange={(option: ResponsableTeam) => {
            setSelectedTeam(option);
            setFormError((prev) => {
              console.log("workshop prev", prev);
              return { ...prev, team: undefined };
            });
          }}
          isDisabled={mutation.isPending && !selectedTeam}
          styles={formError.team ? errorSelectStyles : {}}
        />
        {formError.team && (
          <p className="text-red-500 text-sm mt-1">{formError.team}</p>
        )}

        <SearchableSelect
          options={workshops}
          placeholder="Selecione uma oficina"
          getOptionLabel={(option: Workshop) => option.name}
          getOptionValue={(option: Workshop) => option.id.toString()}
          onChange={(option: Workshop) => {
            setSelectedWorkshop(option);
            setFormError((prev) => {
              console.log("workshop prev", prev);
              return { ...prev, workshop: undefined };
            });
          }}
          isDisabled={mutation.isPending && !selectedWorkshop}
          styles={formError.workshop ? errorSelectStyles : {}}
        />
        {formError.workshop && (
          <p className="text-red-500 text-sm mt-1">{formError.workshop}</p>
        )}

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
                {...register(`vehicleParts.${index}.name`)}
                isInvalid={!!errors.vehicleParts?.[index]?.name}
                errorMessage={errors.vehicleParts?.[index]?.name?.message}
              />
              <Input
                label="Quantidade"
                size="sm"
                type="number"
                className="w-32 max-sm:w-[5rem]"
                {...register(`vehicleParts.${index}.quantity`)}
                isInvalid={!!errors.vehicleParts?.[index]?.quantity}
                errorMessage={errors.vehicleParts?.[index]?.quantity?.message}
              />
              <Input
                label="V. Unitário"
                size="sm"
                type="number"
                step="0.01"
                className="w-32 max-sm:w-[5.3rem]"
                {...register(`vehicleParts.${index}.unitValue`)}
                isInvalid={!!errors.vehicleParts?.[index]?.unitValue}
                errorMessage={errors.vehicleParts?.[index]?.unitValue?.message}
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

          {errors.vehicleParts && !Array.isArray(errors.vehicleParts) && (
            <p className="text-red-500">{errors.vehicleParts.message}</p>
          )}

          {fields.length > 0 && (
            <div className="flex justify-end pt-2">
              <p className="text-lg font-semibold">
                Total: R$ {total.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        <Button
          color="primary"
          variant={mutation.isPending ? "bordered" : "solid"}
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Enviando..." : "Confirmar"}
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
