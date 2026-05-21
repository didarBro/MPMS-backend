import { z } from "zod";
export declare const createProjectSchema: z.ZodObject<{
    name: z.ZodString;
    client: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<{
        PLANNED: "PLANNED";
        ACTIVE: "ACTIVE";
        COMPLETED: "COMPLETED";
        ARCHIVED: "ARCHIVED";
    }>>;
    startDate: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
    endDate: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
    budget: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    thumbnail: z.ZodPipe<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>, z.ZodTransform<string | undefined, string | undefined>>;
}, z.core.$strip>;
export declare const updateProjectSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    client: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        PLANNED: "PLANNED";
        ACTIVE: "ACTIVE";
        COMPLETED: "COMPLETED";
        ARCHIVED: "ARCHIVED";
    }>>>;
    startDate: z.ZodOptional<z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>>;
    endDate: z.ZodOptional<z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>>;
    budget: z.ZodOptional<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    thumbnail: z.ZodOptional<z.ZodPipe<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>, z.ZodTransform<string | undefined, string | undefined>>>;
}, z.core.$strip>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
