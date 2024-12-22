"use client";

import { DRIVER_PROFILE, SUPERVISOR_PROFILE } from "@/api/user";
import VehicleEntryRegistryList from "@/components/vehicle-entry-registry-list";
import { useUserInfoStore } from "@/stores/user-info";
import { Vehicle } from "@/types/api";
import { useRouter } from "next/navigation";

export default function Home() {
  const { userInfo } = useUserInfoStore((state) => state);
  const router = useRouter();

  function handleSupervisorClickVehicleEntry(vehicle: Vehicle) {
    router.push(`vehicle-detail/${vehicle.slug}`);
  }

  function handleDriverClickVehicleEntry(vehicle: Vehicle) {
    router.push(`vehicle-detail/${vehicle.slug}`);
  }

  function handleSupervisorDriverClickVehicleEntry() {
    console.log("Oi!");
  }

  function getClickHandler(profiles: string[]) {
    const isSupervisor = profiles.includes(SUPERVISOR_PROFILE);
    const isDriver = profiles.includes(DRIVER_PROFILE);

    if (isSupervisor && isDriver)
      return handleSupervisorDriverClickVehicleEntry;
    if (isSupervisor) return handleSupervisorClickVehicleEntry;
    if (isDriver) return handleDriverClickVehicleEntry;

    throw new Error("Usuário não é supervisor nem motorista");
  }

  return (
    <>
      {userInfo?.userProfiles && (
        <VehicleEntryRegistryList
          onEntryClick={getClickHandler(userInfo.userProfiles)}
        />
      )}
    </>
  );
}
