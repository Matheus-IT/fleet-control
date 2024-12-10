import { z } from "zod";

export const VehicleSchema = z.object({
  id: z.number(),
  model: z.string(),
  organization: z.number(),
  licence_plate: z.string(),
  slug: z.string(),
  is_at_workshop: z.boolean(),
});

export const WorkshopSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const ResponsableTeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
});

export const UserSchema = z.object({
  name: z.string(),
});

export const VehicleHistorySchema = z.array(
  z.object({
    vehicle_km: z.number(),
    exit_record: z.nullable(
      z.object({
        author: z.object({ name: z.string() }),
        created_at: z.string().transform((value) => new Date(value)), // Convert string to Date
      })
    ),
    workshop: z.nullable(WorkshopSchema),
    problem_reported: z.string(),
    responsable_team: ResponsableTeamSchema,
    author: UserSchema,
    created_at: z.string().transform((value) => new Date(value)), // Convert string to Date
  })
);

export const VehicleHistoryReturnSchema = z.object({
  vehicle: VehicleSchema,
  history: VehicleHistorySchema,
});

export const VehicleEntryRegistrySchema = z.object({
  vehicle: VehicleSchema,
  vehicle_km: z.nullable(z.number()),
  workshop: z.nullable(WorkshopSchema),
  problem_reported: z.string(),
  responsable_team: z.nullable(ResponsableTeamSchema),
  author: z.nullable(UserSchema),
  created_at: z
    .union([z.string(), z.date()]) // Allow both string and Date formats
    .transform((value) =>
      typeof value === "string" ? new Date(value) : value
    ), // Convert string to Date
});

export const VehicleEntrySchema = z.object({
  vehicle: z.number(),
  vehicle_km: z.number(),
  workshop: z.number(),
  problem_reported: z.string(),
  responsable_team: z.number(),
  author: z.number(),
  created_at: z.optional(
    z
      .union([z.string(), z.date()]) // Allow both string and Date formats
      .transform((value) =>
        typeof value === "string" ? new Date(value) : value
      )
  ), // Convert string to Date
});

export const VehicleExitRegistrySchema = z.object({
  entry_record: z.number(),
  author: z.number(),
  created_at: z.optional(
    z
      .union([z.string(), z.date()]) // Allow both string and Date formats
      .transform((value) =>
        typeof value === "string" ? new Date(value) : value
      )
  ), // Convert string to Date
});
