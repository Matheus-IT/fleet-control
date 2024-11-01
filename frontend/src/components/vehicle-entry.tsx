import { VehicleEntry } from "@/types/api";
import { Chip } from "@nextui-org/react";

export default function VehicleEntryTile({
  vehicleEntry,
}: {
  vehicleEntry: VehicleEntry;
}) {
  return (
    <div className="w-full shadow-md rounded-lg p-4 border-l-5 border-l-green-700">
      <Chip className="mr-2">{vehicleEntry.licencePlate}</Chip>
      <span className="text-lg">{vehicleEntry.model}</span>
      <p className="text-base">Estado: {vehicleEntry.state}</p>
      <p className="text-base">{vehicleEntry.description}</p>
      <p className="text-sm">
        Criado por {vehicleEntry.author} em {vehicleEntry.date}
      </p>
    </div>
  );
}
