import { VehicleEntryRegistry } from "@/types/api";
import { Chip } from "@nextui-org/react";

export default function VehicleEntryTile({
  vehicleEntry,
}: {
  vehicleEntry: VehicleEntryRegistry;
}) {
  function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  return (
    <div className="w-full shadow-md rounded-lg p-4 border-l-5 border-l-green-700">
      <p className="text-lg">{vehicleEntry.vehicle.model}</p>
      <div>
        Placa:{" "}
        <Chip className="mr-2">{vehicleEntry.vehicle.licence_plate}</Chip>
      </div>
      <p className="text-base">
        Na oficina:{" "}
        <strong
          className={
            vehicleEntry.vehicle.is_at_workshop
              ? "text-green-700"
              : "text-red-600"
          }
        >
          {vehicleEntry.vehicle.is_at_workshop ? "sim" : "não"}
        </strong>
      </p>
      <p className="text-base">Problema: {vehicleEntry.problem_reported}</p>
      <p className="text-base">Oficina: {vehicleEntry.workshop.name}</p>
      <p className="text-sm">
        Criado por <strong>{vehicleEntry.author.name}</strong> em{" "}
        {formatDate(vehicleEntry.created_at)}
      </p>
    </div>
  );
}
