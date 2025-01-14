"use client";

import { CreateVehicleEntryRecord } from "@/components/vehicle-entry/create-vehicle-entry-record";
import { PageProps } from "../../../../../../.next/types/app/page";
import { useGetVehicle } from "@/hooks/react-query";
import { Spinner } from "@nextui-org/react";
import CreateVehicleExitRecord from "@/components/vehicle-entry/create-vehicle-exit-record";
import WaitingApproval from "@/components/vehicle-entry/waiting-approval";
import { useUserInfoStore } from "@/stores/user-info";
import { DRIVER_PROFILE, SUPERVISOR_PROFILE } from "@/api/user";
import VehicleDetail from "@/components/vehicle-entry/vehicle-detail";
import { useQuery } from "@tanstack/react-query";
import { getLastEntryRecordFromVehicle } from "@/api/request-queries";
import { VehicleEntryStatus } from "@/types/api";
import CorrectLastVehicleEntryRecord from "@/components/vehicle-entry/correct-last-vehicle-entry-record";

export default function VehicleDetailPage({ params }: PageProps) {
  const { data: vehicle } = useGetVehicle(params.vehicle_slug);
  const { data: lastEntryData, isPending } = useQuery({
    queryFn: () => {
      try {
        return getLastEntryRecordFromVehicle(vehicle!);
      } catch (e) {
        console.log("e", e);
      }
    },
    enabled: vehicle != undefined,
    queryKey: ["getLastEntryRecordFromVehicle"],
  });
  const { userInfo } = useUserInfoStore((state) => state);

  if (!vehicle || lastEntryData == undefined || isPending)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  // logic for supervisor
  if (userInfo?.userProfiles.includes(SUPERVISOR_PROFILE)) {
    return <VehicleDetail vehicle={vehicle} />;
  }

  // logic for driver
  if (userInfo?.userProfiles.includes(DRIVER_PROFILE)) {
    if (lastEntryData.status == VehicleEntryStatus.WAITING_APPROVAL)
      return <WaitingApproval vehicle={vehicle} />;

    if (lastEntryData.status == VehicleEntryStatus.NOT_APPROVED)
      return <CorrectLastVehicleEntryRecord lastEntry={lastEntryData} />;

    if (vehicle.is_at_workshop)
      return <CreateVehicleExitRecord vehicle={vehicle} />;

    return <CreateVehicleEntryRecord vehicle={vehicle} />;
  }
  return <p>Perfil desconhecido...</p>;
}
