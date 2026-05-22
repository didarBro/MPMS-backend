import { z } from "zod";

const isoOrEmpty = z.string().optional().transform((v) => (v === "" ? undefined : v));

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  storyPoints: z.coerce.number().int().min(0).optional(),
  estimate: z.coerce.number().min(0).optional(),
  dueDate: isoOrEmpty,
  sprintId: z.string().optional(),
  assigneeId: z.string().optional(),
  parentId: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
