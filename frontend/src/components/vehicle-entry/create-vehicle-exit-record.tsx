import React from "react";
import { useCreateVehicleExitRecordMutation } from "@/hooks/react-query";
import { Vehicle } from "@/types/api";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
} from "@nextui-org/react";
import { Car, LogOut } from "lucide-react";

export default function CreateVehicleExitRecord({
  vehicle,
}: {
  vehicle: Vehicle;
}) {
  const mutation = useCreateVehicleExitRecordMutation(vehicle.id);

  async function handleCreateVehicleExitRecord() {
    await mutation.mutateAsync();
    window.location.reload();
  }

  return (
    <main className="container mx-auto py-6 px-4 max-w-xl">
      <Card className="w-full">
        <CardHeader className="flex gap-3">
          <Car className="w-6 h-6" />
          <div className="flex flex-col">
            <p className="text-xl font-bold">Saída de Veículo</p>
            <p className="text-small text-default-500">
              Confirmar saída da oficina
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Modelo:</span>
                <strong>{vehicle?.model}</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Placa:</span>
                <strong>{vehicle?.licence_plate}</strong>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-700 text-center">
                Este veículo está atualmente na oficina.
                <br />
                Deseja registrar sua saída?
              </p>
            </div>
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-center">
          <Button
            onClick={handleCreateVehicleExitRecord}
            color="primary"
            endContent={<LogOut className="w-4 h-4" />}
            size="lg"
          >
            Confirmar Saída
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
