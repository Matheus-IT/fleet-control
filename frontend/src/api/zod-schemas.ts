import { z } from "zod";

export const VehicleSchema = z.object({
  model: z.string(),
  organization: z.number(),
  licence_plate: z.string(),
  slug: z.string(),
  is_at_workshop: z.boolean(),
});

export const WorkshopSchema = z.object({
  name: z.string(),
});

export const ResponsableTeamSchema = z.object({
  name: z.string(),
  type: z.string(),
});

export const UserSchema = z.object({
  name: z.string(),
});

export const VehicleEntryRegistrySchema = z.object({
  vehicle: VehicleSchema,
  vehicle_km: z.number(),
  workshop: WorkshopSchema,
  problem_reported: z.string(),
  responsable_team: ResponsableTeamSchema,
  author: UserSchema,
  created_at: z
    .union([z.string(), z.date()]) // Allow both string and Date formats
    .transform((value) =>
      typeof value === "string" ? new Date(value) : value
    ), // Convert string to Date
});