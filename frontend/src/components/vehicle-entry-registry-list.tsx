import VehicleEntryTile from "@/components/vehicle-entry";
import { useGetVehicleEntries } from "@/hooks/react-query";
import { Vehicle } from "@/types/api";
import { Button, Spinner, Pagination, Badge, Tooltip } from "@heroui/react";
import { useState } from "react";

export default function VehicleEntryRegistryList({
  onEntryClick,
}: {
  onEntryClick: (vehicle: Vehicle) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAtWorkshopStatus, setFilterAtWorkshopStatus] = useState<
    boolean | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsCount, setItemsCount] = useState(0);
  const itemsPerPage = 5;

  const { data, isPending, error } = useGetVehicleEntries(
    searchQuery,
    itemsPerPage,
    currentPage,
    filterAtWorkshopStatus,
    (resData) => {
      setItemsCount(resData.count as number);
    }
  );

  return (
    <main className="container mx-auto lg:w-[61rem]">
      <div className="flex flex-col gap-4 max-sm:p-4">
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

            <Tooltip content="Quantos veículos estão na oficina" showArrow>
              <Badge
                color="warning"
                content={itemsCount}
                isInvisible={filterAtWorkshopStatus != true}
              >
                <Button
                  onPress={() => {
                    if (filterAtWorkshopStatus == null) {
                      setFilterAtWorkshopStatus(true);
                    } else {
                      setFilterAtWorkshopStatus(null);
                    }
                  }}
                  color="primary"
                  variant={
                    filterAtWorkshopStatus == true ? "solid" : "bordered"
                  }
                >
                  Está na oficina
                </Button>
              </Badge>
            </Tooltip>

            <Tooltip content="Quantos veículos não estão na oficina" showArrow>
              <Badge
                color="warning"
                content={itemsCount}
                isInvisible={filterAtWorkshopStatus != false}
              >
                <Button
                  onPress={() => {
                    if (filterAtWorkshopStatus == null) {
                      setFilterAtWorkshopStatus(false);
                    } else {
                      setFilterAtWorkshopStatus(null);
                    }
                  }}
                  color="primary"
                  variant={
                    filterAtWorkshopStatus == false ? "solid" : "bordered"
                  }
                >
                  Não está na oficina
                </Button>
              </Badge>
            </Tooltip>
          </div>
        </div>

        {data && data.results.length > 0 && (
          <>
            <div className="flex flex-col gap-4">
              {data.results.map((v) => (
                <VehicleEntryTile
                  key={v.vehicle.licence_plate}
                  onClick={() => onEntryClick(v.vehicle)}
                  vehicleEntry={v}
                />
              ))}
            </div>
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
