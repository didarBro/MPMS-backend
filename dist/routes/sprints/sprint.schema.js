"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderSchema = exports.updateSprintSchema = exports.createSprintSchema = void 0;
const zod_1 = require("zod");
const isoDateOrEmpty = zod_1.z
    .string()
    .optional()
    .transform((v) => (v === "" ? undefined : v));
const baseSprintSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required").max(120),
    goal: zod_1.z.string().max(500).optional(),
    status: zod_1.z.enum(["PLANNED", "ACTIVE", "COMPLETED"]).default("PLANNED"),
    startDate: isoDateOrEmpty,
    endDate: isoDateOrEmpty,
});
const dateOrderCheck = {
    check: (data) => {
        if (data.startDate && data.endDate) {
            return new Date(data.endDate) > new Date(data.startDate);
        }
        return true;
    },
    message: { message: "End date must be after start date", path: ["endDate"] },
};
exports.createSprintSchema = baseSprintSchema.refine(dateOrderCheck.check, dateOrderCheck.message);
exports.updateSprintSchema = baseSprintSchema.partial().refine(dateOrderCheck.check, dateOrderCheck.message);
exports.reorderSchema = zod_1.z.object({
    orderedIds: zod_1.z.array(zod_1.z.string()).min(1, "orderedIds must not be empty"),
});
//# sourceMappingURL=sprint.schema.js.map