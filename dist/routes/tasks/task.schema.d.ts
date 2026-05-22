import { z } from "zod";
export declare const createTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<{
        TODO: "TODO";
        IN_PROGRESS: "IN_PROGRESS";
        IN_REVIEW: "IN_REVIEW";
        DONE: "DONE";
    }>>;
    priority: z.ZodDefault<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>>;
    storyPoints: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    estimate: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    dueDate: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
    sprintId: z.ZodOptional<z.ZodString>;
    assigneeId: z.ZodOptional<z.ZodString>;
    parentId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateTaskSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        TODO: "TODO";
        IN_PROGRESS: "IN_PROGRESS";
        IN_REVIEW: "IN_REVIEW";
        DONE: "DONE";
    }>>>;
    priority: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>>>;
    storyPoints: z.ZodOptional<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    estimate: z.ZodOptional<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    dueDate: z.ZodOptional<z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>>;
    sprintId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    assigneeId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    parentId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const updateStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        TODO: "TODO";
        IN_PROGRESS: "IN_PROGRESS";
        IN_REVIEW: "IN_REVIEW";
        DONE: "DONE";
    }>;
}, z.core.$strip>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
