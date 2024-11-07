"use client";

import { getProfileInfo } from "@/api/request-queries";
import { SUPERVISOR_PROFILE } from "@/api/user";
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
      {data && data.user_profiles.includes(SUPERVISOR_PROFILE) && (
        <SupervisorDashboard />
      )}
      {isPending && (
        <div className="h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
    </>
  );
}
