import {
  SubmitLoginCredentialsSchema,
  VehicleEntryRegistrySchema,
  VehicleEntryRegistrySchemaDetail,
  VehicleRegistrySchemaList as VehicleEntryRegistrySchemaList,
  VehicleEntrySchema,
  VehicleExitRegistrySchema,
  VehiclePartSchema,
  VehicleSchema,
} from "@/api/zod-schemas";
import { z } from "zod";

export type Vehicle = z.infer<typeof VehicleSchema>;

export type VehiclePart = z.infer<typeof VehiclePartSchema>;

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

export enum VehicleEntryStatus {
  APPROVED = "Aprovado",
  NOT_APPROVED = "Não aprovado",
  WAITING_APPROVAL = "Aguardando aprovação",
}

export type VehicleEntryRegistry = z.infer<typeof VehicleEntryRegistrySchema>;
export type VehicleEntryRegistryList = z.infer<
  typeof VehicleEntryRegistrySchemaList
>;
export type VehicleEntryRegistryDetail = z.infer<
  typeof VehicleEntryRegistrySchemaDetail
>;

export type VehicleEntry = z.infer<typeof VehicleEntrySchema>;

export type VehicleExitRegistry = z.infer<typeof VehicleExitRegistrySchema>;

export type SubmitLoginCredentials = z.infer<
  typeof SubmitLoginCredentialsSchema
>;

export type AuthCredentials = {
  access: string;
  refresh: string;
};
