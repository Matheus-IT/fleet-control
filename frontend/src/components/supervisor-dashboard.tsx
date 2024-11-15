import VehicleEntryRegistryList from "./vehicle-entry-registry-list";

export default function SupervisorDashboard() {
  function handleSupervisorClickVehicleEntry() {
    console.log("Salut!");
  }

  return (
    <main className="container mx-auto h-screen">
      <VehicleEntryRegistryList
        onEntryClick={handleSupervisorClickVehicleEntry}
      />
    </main>
  );
}
