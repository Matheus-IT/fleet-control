import { VehiclePart } from "@/types/api";

export const calculateTotal = (parts: VehiclePart[]) => {
  return parts.reduce((sum, part) => sum + part.unit_value * part.quantity, 0);
};
