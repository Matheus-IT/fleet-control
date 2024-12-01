import { Vehicle } from "@/types/api";
import { Button } from "@nextui-org/react";

export default function CreateVehicleExitRecord({
  vehicle,
}: {
  vehicle: Vehicle;
}) {
  function handleCreateVehicleExitRecord() {
    console.log("hey!");
  }
  return (
    <main className="container mx-auto pt-4">
      <h1>Modelo: {vehicle?.model}</h1>
      <h1>Placa: {vehicle?.licence_plate}</h1>
      <h1>
        Veiculo está na oficina, deseja
        <Button
          onClick={handleCreateVehicleExitRecord}
          color="primary"
          className="mx-1"
        >
          sair
        </Button>
        ?
      </h1>
    </main>
  );
}
