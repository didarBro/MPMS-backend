"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMemberRoleSchema = exports.addMemberSchema = exports.updateTeamSchema = exports.createTeamSchema = void 0;
const zod_1 = require("zod");
exports.createTeamSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required").max(100),
    description: zod_1.z.string().optional(),
    projectId: zod_1.z.string().min(1, "Project is required"),
});
exports.updateTeamSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    description: zod_1.z.string().nullable().optional(),
});
exports.addMemberSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, "User is required"),
    role: zod_1.z.enum(["ADMIN", "MANAGER", "MEMBER"]).default("MEMBER"),
});
exports.updateMemberRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(["ADMIN", "MANAGER", "MEMBER"]),
});
//# sourceMappingURL=team.schema.js.map