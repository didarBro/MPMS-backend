"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectSchema = exports.createProjectSchema = void 0;
const zod_1 = require("zod");
const isoDateOrEmpty = zod_1.z
    .string()
    .optional()
    .transform((v) => (v === "" ? undefined : v));
exports.createProjectSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    client: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(["PLANNED", "ACTIVE", "COMPLETED", "ARCHIVED"]).default("PLANNED"),
    startDate: isoDateOrEmpty,
    endDate: isoDateOrEmpty,
    budget: zod_1.z.coerce.number().positive("Budget must be positive").optional(),
    thumbnail: zod_1.z
        .string()
        .url("Thumbnail must be a valid URL")
        .optional()
        .or(zod_1.z.literal(""))
        .transform((v) => (v === "" ? undefined : v)),
});
exports.updateProjectSchema = exports.createProjectSchema.partial();
//# sourceMappingURL=project.schema.js.map