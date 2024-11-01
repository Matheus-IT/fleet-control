import { VehicleEntry, VehicleEntryDTO } from "@/types/api";

export const formatVehicleEntry = (v: VehicleEntryDTO): VehicleEntry => ({
  state: v.state,
  licencePlate: v.licence_plate,
  model: v.model,
  description: v.description,
  author: v.author,
  date: v.date,
});
