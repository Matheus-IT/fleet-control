import {
  VehicleEntryRegistrySchema,
  VehicleEntrySchema,
  VehicleExitRegistrySchema,
  VehicleSchema,
} from "@/api/zod-schemas";
import { z } from "zod";

export type Vehicle = z.infer<typeof VehicleSchema>;

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

export enum VehicleEntryRegistryChoices {
  APPROVED = "Aprovado",
  WAITING_APPROVAL = "Aguardando aprovação",
}

export type VehicleEntryRegistry = z.infer<typeof VehicleEntryRegistrySchema>;

export type VehicleEntry = z.infer<typeof VehicleEntrySchema>;

export type VehicleExitRegistry = z.infer<typeof VehicleExitRegistrySchema>;

export type SubmitLoginCredentials = {
  email: string;
  password: string;
};

export type AuthCredentials = {
  access: string;
  refresh: string;
};
