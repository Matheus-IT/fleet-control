"use client";

import { getProfileInfo } from "@/api/request-queries";
import { DRIVER_PROFILE, SUPERVISOR_PROFILE } from "@/api/user";
import DriverDashboard from "@/components/driver-dashboard";
import MyNavbar from "@/components/navbar";
import SupervisorDashboard from "@/components/supervisor-dashboard";
import { useAuthenticatedQuery } from "@/hooks/react-query";
import { Spinner } from "@nextui-org/react";

export default function Home() {
  const { data, isPending } = useAuthenticatedQuery(
    ["profileInfo"],
    getProfileInfo
  );

  return (
    <>
      <MyNavbar />

      {data && data.user_profiles.includes(SUPERVISOR_PROFILE) && (
        <SupervisorDashboard />
      )}
      {data && data.user_profiles.includes(DRIVER_PROFILE) && (
        <DriverDashboard />
      )}
      {isPending && (
        <div className="h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
    </>
  );
}
