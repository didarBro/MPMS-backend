import { z } from "zod";

const isoDateOrEmpty = z
  .string()
  .optional()
  .transform((v) => (v === "" ? undefined : v));

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  client: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["PLANNED", "ACTIVE", "COMPLETED", "ARCHIVED"]).default("PLANNED"),
  startDate: isoDateOrEmpty,
  endDate: isoDateOrEmpty,
  budget: z.coerce.number().positive("Budget must be positive").optional(),
  thumbnail: z
    .string()
    .url("Thumbnail must be a valid URL")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
