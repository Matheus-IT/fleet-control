"use client";

import { DRIVER_PROFILE, SUPERVISOR_PROFILE } from "@/api/user";
import MyNavbar from "@/components/navbar";
import VehicleEntryRegistryList from "@/components/vehicle-entry-registry-list";
import { useGetProfileInfo } from "@/hooks/react-query";
import { Spinner } from "@nextui-org/react";

export default function Home() {
  const { data, isPending, error } = useGetProfileInfo();

  function handleSupervisorClickVehicleEntry() {
    console.log("Salut!");
  }

  function handleDriverClickVehicleEntry() {
    console.log("Hallo!");
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
      <MyNavbar nameOfUser={data?.user_name} />

      {data?.user_profiles && (
        <VehicleEntryRegistryList
          onEntryClick={getClickHandler(data.user_profiles)}
        />
      )}

      {isPending && (
        <div className="h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {error && <h1>Ocorreu um erro: {error.message}</h1>}
    </>
  );
}
