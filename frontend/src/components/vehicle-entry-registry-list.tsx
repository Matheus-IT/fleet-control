import VehicleEntryTile from "@/components/vehicle-entry";
import { useGetVehicleEntries } from "@/hooks/react-query";
import { Spinner } from "@nextui-org/react";
import { useMemo, useState } from "react";

export default function VehicleEntryRegistryList({
  onEntryClick,
}: {
  onEntryClick: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isPending, error } = useGetVehicleEntries(searchQuery);

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase().trim();
    return data.filter((entry) => {
      const vehicle = entry.vehicle;
      return (
        vehicle.licence_plate.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        entry?.workshop?.name.toLowerCase().includes(query)
      );
    });
  }, [data, searchQuery]);

  return (
    <main className="container mx-auto h-screen">
      <div className="flex flex-col gap-4 max-sm:p-4">
        {data && data.length > 0 && (
          <>
            <h1 className="text-2xl text-center mt-6">Registros de veículos</h1>
            <input
              type="text"
              placeholder="Buscar por placa, oficina ou modelo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {filteredData.length > 0 && (
              <div className="flex flex-col gap-4">
                {filteredData.map((v) => (
                  <VehicleEntryTile
                    key={v.vehicle.licence_plate}
                    onClick={onEntryClick}
                    vehicleEntry={v}
                  />
                ))}
              </div>
            )}
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
        {error && <h1>Ocorreu um erro: {error.message}</h1>}
      </div>
    </main>
  );
}
