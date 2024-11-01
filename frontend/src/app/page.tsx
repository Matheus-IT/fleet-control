"use client";

import VehicleEntryTile from "@/components/vehicle-entry";
import { getAccessToken, getRefreshToken, setAccessToken } from "@/http-client";
import { VehicleEntryDTO } from "@/types/api";
import { formatVehicleEntry } from "@/utils/vehicle-entries";
import { Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const { isPending, error, data } = useQuery({
    queryKey: ["fetchVehicleEntries"],
    retry: false,
    queryFn: async () => {
      const res = await fetch("http://localhost:8000/api/vehicle-entries/", {
        headers: {
          Authorization: "Bearer " + getAccessToken(),
        },
      });

      if (res.ok) {
        const vehicleEntries: VehicleEntryDTO[] = await res.json();
        return vehicleEntries.map(formatVehicleEntry);
      }

      if (res.status == 401) {
        console.log("Not allowed");
        const response = await fetch(
          "http://localhost:8000/api/token/refresh/",
          {
            method: "POST",
            body: JSON.stringify({ refresh: getRefreshToken() }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("retrying...");

        if (response.ok) {
          const { access } = await response.json();
          setAccessToken(access);

          console.log("fetching vehicles with new token");

          const res = await fetch(
            "http://localhost:8000/api/vehicle-entries/",
            {
              headers: {
                Authorization: "Bearer " + getAccessToken(),
              },
            }
          );

          if (res.ok) {
            const vehicleEntries: VehicleEntryDTO[] = await res.json();
            return vehicleEntries.map(formatVehicleEntry);
          }
        } else {
          router.push("/login/");
        }
      }
      return [];
    },
  });

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
        {error && <h1 className="text-center text-lg">Aconteceu um erro!</h1>}
      </div>
    </main>
  );
}
