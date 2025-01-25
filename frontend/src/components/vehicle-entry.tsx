import { VehicleEntryRegistryList, VehicleEntryStatus } from "@/types/api";
import { Chip, Tooltip } from "@heroui/react";
import { CircleAlert } from "lucide-react";
// import { formatDate, formatTime } from "../../utils/date-time";

export default function VehicleEntryTile({
  vehicleEntry,
  onClick,
}: {
  vehicleEntry: VehicleEntryRegistryList;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="w-full flex justify-between items-center shadow-md rounded-lg p-4 border-l-5 border-l-green-700 cursor-pointer hover:border-l-green-800 hover:shadow-lg"
    >
      <div>
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
      </div>

      <div>
        {vehicleEntry.status == VehicleEntryStatus.WAITING_APPROVAL && (
          <Tooltip content="Aguardando aprovação">
            <div className="rounded-full p-1 bg-warning-500">
              <CircleAlert />
            </div>
          </Tooltip>
        )}

        {vehicleEntry.status == VehicleEntryStatus.NOT_APPROVED && (
          <Tooltip content="Não aprovado">
            <div className="rounded-full p-1 bg-danger-500">
              <CircleAlert />
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
