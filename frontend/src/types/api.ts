import {
  VehicleEntryRegistrySchema,
  VehicleEntrySchema,
} from "@/api/zod-schemas";
import { z } from "zod";

export interface Vehicle {
  model: string;
  organization: number;
  licence_plate: string;
  slug: string;
  is_at_workshop: boolean;
}

export interface Workshop {
  id: number;
  name: string;
}

export interface ResponsableTeam {
  id: number;
  name: string;
  type: string;
}

export interface User {
  name: string;
}

export type VehicleEntryRegistry = z.infer<typeof VehicleEntryRegistrySchema>;

export type VehicleEntry = z.infer<typeof VehicleEntrySchema>;

export type SubmitLoginCredentials = {
  email: string;
  password: string;
};

export type AuthCredentials = {
  access: string;
  refresh: string;
};
