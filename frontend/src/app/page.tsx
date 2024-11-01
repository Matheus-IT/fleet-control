"use client";
import VehicleEntryTile from "@/components/vehicle-entry";
import HttpClient, { urls } from "@/http-client";
import { VehicleEntry, VehicleEntryDTO } from "@/types/api";
import { formatVehicleEntry } from "@/utils/vehicle-entries";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [vehicles, setVehicles] = useState<VehicleEntry[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function doTheJob() {
      const res = await HttpClient.get(urls.vehicleEntries);
      if (res.ok) {
        const vehicleEntries: VehicleEntryDTO[] = await res.json();
        setVehicles(vehicleEntries.map(formatVehicleEntry));
      } else if (res.status == 401) {
        router.push("login/");
      } else {
        console.log("Error when getting vehicles:", res);
      }
    }

    doTheJob();
  }, [router]);

  return (
    <main className="container mx-auto h-screen">
      <div className="flex flex-col gap-4 max-sm:p-4">
        {vehicles != null && vehicles.length > 0 && (
          <>
            <h1 className="text-2xl text-center mt-6">Registros de veículos</h1>
            {vehicles.map((v) => (
              <VehicleEntryTile key={v.licencePlate} vehicleEntry={v} />
            ))}
          </>
        )}
        {vehicles != null && vehicles.length == 0 && (
          <h1 className="text-center">Nenhum registro de veículo.</h1>
        )}
        {vehicles == null && (
          <div className="h-screen flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        )}
      </div>
    </main>
  );
}
