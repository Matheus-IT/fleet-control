import VehicleEntryRegistryList from "./vehicle-entry-registry-list";

export default function DriverDashboard() {
  function handleDriverClickVehicleEntry() {
    console.log("Hallo!");
  }

  return (
    <main className="container mx-auto h-screen">
      <VehicleEntryRegistryList onEntryClick={handleDriverClickVehicleEntry} />
    </main>
  );
}
