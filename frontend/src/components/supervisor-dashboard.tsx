import { getVehicleEntries } from "@/api/request-queries";
import VehicleEntryTile from "@/components/vehicle-entry";
import { useAuthenticatedQuery } from "@/hooks/react-query";
import { Spinner } from "@nextui-org/react";

export default function SupervisorDashboard() {
  const { data, isPending } = useAuthenticatedQuery(
    ["vehicleEntries"],
    getVehicleEntries
  );

  return (
    <main className="container mx-auto h-screen">
      <div className="flex flex-col gap-4 max-sm:p-4">
        {data && data.length > 0 && (
          <>
            <h1 className="text-2xl text-center mt-6">Registros de veículos</h1>
            {data.map((v) => (
              <VehicleEntryTile key={v.licencePlate} vehicleEntry={v} />
            ))}
          </>
        )}
        {data && data.length == 0 && (
          <h1 className="text-center text-lg">Nenhum registro de veículo.</h1>
        )}
        {isPending && (
          <div className="h-screen flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        )}
      </div>
    </main>
  );
}
