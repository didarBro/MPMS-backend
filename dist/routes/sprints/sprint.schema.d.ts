import { z } from "zod";
export declare const createSprintSchema: z.ZodObject<{
    name: z.ZodString;
    goal: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<{
        PLANNED: "PLANNED";
        ACTIVE: "ACTIVE";
        COMPLETED: "COMPLETED";
    }>>;
    startDate: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
    endDate: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
}, z.core.$strip>;
export declare const updateSprintSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    goal: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        PLANNED: "PLANNED";
        ACTIVE: "ACTIVE";
        COMPLETED: "COMPLETED";
    }>>>;
    startDate: z.ZodOptional<z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>>;
    endDate: z.ZodOptional<z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>>;
}, z.core.$strip>;
export declare const reorderSchema: z.ZodObject<{
    orderedIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type CreateSprintInput = z.infer<typeof createSprintSchema>;
export type UpdateSprintInput = z.infer<typeof updateSprintSchema>;
export type ReorderInput = z.infer<typeof reorderSchema>;
