"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusSchema = exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
const isoOrEmpty = zod_1.z.string().optional().transform((v) => (v === "" ? undefined : v));
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).default("TODO"),
    priority: zod_1.z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
    storyPoints: zod_1.z.coerce.number().int().min(1, "Story points must be at least 1").optional(),
    estimate: zod_1.z.coerce.number().positive("Estimate must be a positive number").optional(),
    dueDate: isoOrEmpty,
    sprintId: zod_1.z.string().optional(),
    assigneeId: zod_1.z.string().optional(),
    parentId: zod_1.z.string().optional(),
});
exports.updateTaskSchema = exports.createTaskSchema.partial();
exports.updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
});
//# sourceMappingURL=task.schema.js.map