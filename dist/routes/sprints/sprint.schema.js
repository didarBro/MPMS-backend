"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderSchema = exports.updateSprintSchema = exports.createSprintSchema = void 0;
const zod_1 = require("zod");
const isoDateOrEmpty = zod_1.z
    .string()
    .optional()
    .transform((v) => (v === "" ? undefined : v));
exports.createSprintSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    goal: zod_1.z.string().optional(),
    status: zod_1.z.enum(["PLANNED", "ACTIVE", "COMPLETED"]).default("PLANNED"),
    startDate: isoDateOrEmpty,
    endDate: isoDateOrEmpty,
});
exports.updateSprintSchema = exports.createSprintSchema.partial();
exports.reorderSchema = zod_1.z.object({
    orderedIds: zod_1.z.array(zod_1.z.string()).min(1, "orderedIds must not be empty"),
});
//# sourceMappingURL=sprint.schema.js.map