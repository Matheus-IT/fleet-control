"use client";

import { CreateVehicleEntryRecord } from "@/components/vehicle-entry/create-vehicle-entry-record";
import { Spinner } from "@heroui/react";
import CreateVehicleExitRecord from "@/components/vehicle-entry/create-vehicle-exit-record";
import WaitingApproval from "@/components/vehicle-entry/waiting-approval";
import { useUserInfoStore } from "@/stores/user-info";
import { DRIVER_PROFILE, SUPERVISOR_PROFILE } from "@/api/user";
import VehicleDetail from "@/components/vehicle-entry/vehicle-detail";
import { useQuery } from "@tanstack/react-query";
import { getLastEntryRecordFromVehicle } from "@/api/request-queries";
import { VehicleEntryStatus } from "@/types/api";
import CorrectLastVehicleEntryRecord from "@/components/vehicle-entry/correct-last-vehicle-entry-record";

export default function VehicleDetailPage({
  params,
}: {
  params: { vehicle_slug: string };
}) {
  console.log("--------------------------------------------------------------");

  const { data: lastEntryData, isPending } = useQuery({
    queryFn: () => {
      try {
        console.log("Performing request!!!");
        return getLastEntryRecordFromVehicle(params.vehicle_slug);
      } catch (e) {
        console.log("e", e);
      }
    },
    queryKey: ["getLastEntryRecordFromVehicle", params.vehicle_slug],
  });
  const { userInfo } = useUserInfoStore((state) => state);

  if (!lastEntryData || isPending)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  // logic for supervisor
  if (userInfo?.userProfiles.includes(SUPERVISOR_PROFILE)) {
    console.log("Supervisor profile");
    return <VehicleDetail lastEntryData={lastEntryData} />;
  }

  // logic for driver
  if (userInfo?.userProfiles.includes(DRIVER_PROFILE)) {
    console.log("Driver profile");

    if (lastEntryData.status == VehicleEntryStatus.WAITING_APPROVAL) {
      console.log("Waiting approval");
      return <WaitingApproval lastEntryData={lastEntryData} />;
    }

    if (lastEntryData.status == VehicleEntryStatus.NOT_APPROVED) {
      console.log("Not approved");
      return <CorrectLastVehicleEntryRecord lastEntry={lastEntryData} />;
    }

    if (
      lastEntryData.vehicle.is_at_workshop &&
      lastEntryData.status == VehicleEntryStatus.APPROVED
    ) {
      console.log("Create exit record");
      return <CreateVehicleExitRecord lastEntryData={lastEntryData} />;
    }

    console.log("Create entry record");
    return <CreateVehicleEntryRecord lastEntryData={lastEntryData} />;
  }
  return <p>Perfil desconhecido...</p>;
}
