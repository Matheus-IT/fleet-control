import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getVehicleEntries } from "@/api/vehicles";
import { VehicleEntry } from "@/types/api";

export function useVehicleEntries() {
  const router = useRouter();
  const query = useQuery<VehicleEntry[], Error>({
    queryKey: ["vehicleEntries"],
    queryFn: getVehicleEntries,
    retry: false,
  });

  useEffect(() => {
    if (query.error?.message === "refresh_failed") {
      router.push("/login");
    }
  }, [query.error, router]);

  return query;
}
