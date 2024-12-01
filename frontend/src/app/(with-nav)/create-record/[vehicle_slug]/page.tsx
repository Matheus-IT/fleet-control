"use client";

import { CreateVehicleEntryRecord } from "@/components/vehicle-entry/create-vehicle-entry-record";
import { PageProps } from "../../../../../.next/types/app/page";
import { useGetVehicle } from "@/hooks/react-query";
import { Spinner } from "@nextui-org/react";
import CreateVehicleExitRecord from "@/components/vehicle-entry/create-vehicle-exit-record";

export default function CreateRecordPage({ params }: PageProps) {
  const { data: vehicle } = useGetVehicle(params.vehicle_slug);

  if (!vehicle)
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  if (vehicle.is_at_workshop)
    return <CreateVehicleExitRecord vehicle={vehicle} />;
  return <CreateVehicleEntryRecord vehicle={vehicle} />;
}
