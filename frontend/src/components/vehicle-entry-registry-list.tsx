import VehicleEntryTile from "@/components/vehicle-entry";
import { useGetVehicleEntries } from "@/hooks/react-query";
import { Vehicle } from "@/types/api";
import { Button, Spinner, Pagination } from "@nextui-org/react";
import { useMemo, useState } from "react";

export default function VehicleEntryRegistryList({
  onEntryClick,
}: {
  onEntryClick: (vehicle: Vehicle) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAtWorkshop, setFilterAtWorkshop] = useState(false);
  const [filterNotAtWorkshop, setFilterNotAtWorkshop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data, isPending, error } = useGetVehicleEntries(
    searchQuery,
    itemsPerPage,
    currentPage
  );

  const filteredData = useMemo(() => {
    if (!data) return [];

    if (!searchQuery.trim() && !filterAtWorkshop && !filterNotAtWorkshop)
      return data.results;

    const query = searchQuery.toLowerCase().trim();

    return data.results.filter((entry) => {
      const vehicle = entry.vehicle;
      return (
        (query &&
          (vehicle.licence_plate.toLowerCase().includes(query) ||
            vehicle.model.toLowerCase().includes(query) ||
            entry?.workshop?.name.toLowerCase().includes(query))) ||
        (filterAtWorkshop == true && vehicle.is_at_workshop == true) ||
        (filterNotAtWorkshop == true && vehicle.is_at_workshop == false)
      );
    });
  }, [data, searchQuery, filterAtWorkshop, filterNotAtWorkshop]);

  return (
    <main className="container mx-auto">
      <div className="flex flex-col gap-4 max-sm:p-4">
        {data && data.results.length > 0 && (
          <>
            <h1 className="text-2xl text-center mt-6">Registros de veículos</h1>

            <div className="flex gap-4 max-sm:flex-col">
              <input
                type="text"
                placeholder="Buscar por placa, oficina ou modelo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-2 items-center">
                <span>Filtros:</span>
                <Button
                  onClick={() => {
                    setFilterAtWorkshop(!filterAtWorkshop);
                    if (filterNotAtWorkshop) {
                      setFilterNotAtWorkshop(false);
                    }
                  }}
                  color="primary"
                  variant={filterAtWorkshop ? "solid" : "bordered"}
                >
                  Está na oficina
                </Button>

                <Button
                  onClick={() => {
                    setFilterNotAtWorkshop(!filterNotAtWorkshop);
                    if (filterAtWorkshop) {
                      setFilterAtWorkshop(false);
                    }
                  }}
                  color="primary"
                  variant={filterNotAtWorkshop ? "solid" : "bordered"}
                >
                  Não está na oficina
                </Button>
              </div>
            </div>

            {filteredData.length > 0 && (
              <div className="flex flex-col gap-4">
                {filteredData.map((v) => (
                  <VehicleEntryTile
                    key={v.vehicle.licence_plate}
                    onClick={() => onEntryClick(v.vehicle)}
                    vehicleEntry={v}
                  />
                ))}
              </div>
            )}

            <Pagination
              total={data.numPages}
              page={currentPage}
              onChange={(newPage) => setCurrentPage(newPage)}
            />
          </>
        )}
        {data && data.results.length == 0 && (
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
