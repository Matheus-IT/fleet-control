"use client";

import { CreateVehicleEntryRecord } from "@/components/vehicle-entry/create-vehicle-entry-record";
import { PageProps } from "../../../../../.next/types/app/page";
import { useGetVehicle } from "@/hooks/react-query";
import { Spinner } from "@nextui-org/react";
import CreateVehicleExitRecord from "@/components/vehicle-entry/create-vehicle-exit-record";
import WaitingApproval from "@/components/vehicle-entry/waiting-approval";
import { useUserInfoStore } from "@/stores/user-info";
import { SUPERVISOR_PROFILE } from "@/api/user";
import VehicleDetail from "@/components/vehicle-entry/vehicle-detail";

export default function VehicleDetailPage({ params }: PageProps) {
  const { data: vehicle } = useGetVehicle(params.vehicle_slug);
  const { userInfo } = useUserInfoStore((state) => state);

  if (!vehicle)
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
  if (!vehicle.can_enter_workshop) return <WaitingApproval vehicle={vehicle} />;

  if (vehicle.is_at_workshop)
    return <CreateVehicleExitRecord vehicle={vehicle} />;

  return <CreateVehicleEntryRecord vehicle={vehicle} />;
}
