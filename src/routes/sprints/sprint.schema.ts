import { z } from "zod";

const isoDateOrEmpty = z
  .string()
  .optional()
  .transform((v) => (v === "" ? undefined : v));

const baseSprintSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  goal: z.string().max(500).optional(),
  status: z.enum(["PLANNED", "ACTIVE", "COMPLETED"]).default("PLANNED"),
  startDate: isoDateOrEmpty,
  endDate: isoDateOrEmpty,
});

const dateOrderCheck = {
  check: (data: { startDate?: string; endDate?: string }) => {
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) > new Date(data.startDate);
    }
    return true;
  },
  message: { message: "End date must be after start date", path: ["endDate"] } as const,
};

export const createSprintSchema = baseSprintSchema.refine(
  dateOrderCheck.check,
  dateOrderCheck.message
);

export const updateSprintSchema = baseSprintSchema.partial().refine(
  dateOrderCheck.check,
  dateOrderCheck.message
);

export const reorderSchema = z.object({
  orderedIds: z.array(z.string()).min(1, "orderedIds must not be empty"),
});

export type CreateSprintInput = z.infer<typeof createSprintSchema>;
export type UpdateSprintInput = z.infer<typeof updateSprintSchema>;
export type ReorderInput = z.infer<typeof reorderSchema>;
