import { VehicleEntryRegistry } from "@/types/api";
import { Chip } from "@nextui-org/react";

export default function VehicleEntryTile({
  vehicleEntry,
  onClick,
}: {
  vehicleEntry: VehicleEntryRegistry;
  onClick: () => void;
}) {
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
    <div
      onClick={onClick}
      className="w-full shadow-md rounded-lg p-4 border-l-5 border-l-green-700 cursor-pointer hover:border-l-green-800 hover:shadow-lg"
    >
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
      {vehicleEntry.vehicle.is_at_workshop && (
        <>
          <p className="text-base">Problema: {vehicleEntry.problem_reported}</p>
          {vehicleEntry.workshop && (
            <p className="text-base">Oficina: {vehicleEntry.workshop.name}</p>
          )}
        </>
      )}

      <p className="text-sm">
        {vehicleEntry.author ? (
          <>
            Ultima atualização em{" "}
            <strong>{formatDate(vehicleEntry.created_at)}</strong> as{" "}
            {formatTime(vehicleEntry.created_at)} por{" "}
            <strong>{vehicleEntry.author.name}</strong>
          </>
        ) : (
          <>
            Registro do veículo criado em{" "}
            <strong>{formatDate(vehicleEntry.created_at)}</strong> as{" "}
            {formatTime(vehicleEntry.created_at)}
          </>
        )}
      </p>
    </div>
  );
}
