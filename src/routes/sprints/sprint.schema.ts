import { z } from "zod";

const isoDateOrEmpty = z
  .string()
  .optional()
  .transform((v) => (v === "" ? undefined : v));

export const createSprintSchema = z.object({
  name: z.string().min(1, "Name is required"),
  goal: z.string().optional(),
  status: z.enum(["PLANNED", "ACTIVE", "COMPLETED"]).default("PLANNED"),
  startDate: isoDateOrEmpty,
  endDate: isoDateOrEmpty,
});

export const updateSprintSchema = createSprintSchema.partial();

export const reorderSchema = z.object({
  orderedIds: z.array(z.string()).min(1, "orderedIds must not be empty"),
});

export type CreateSprintInput = z.infer<typeof createSprintSchema>;
export type UpdateSprintInput = z.infer<typeof updateSprintSchema>;
export type ReorderInput = z.infer<typeof reorderSchema>;
