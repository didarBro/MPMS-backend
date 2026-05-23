"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../config/db");
const ApiError_1 = require("../../utils/ApiError");
const SALT_ROUNDS = 12;
const USER_SELECT = {
    id: true,
    name: true,
    email: true,
    role: true,
    avatar: true,
    department: true,
    skills: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
};
async function list(filters) {
    const where = {};
    if (filters.search) {
        where["OR"] = [
            { name: { contains: filters.search, mode: "insensitive" } },
            { email: { contains: filters.search, mode: "insensitive" } },
        ];
    }
    if (filters.role)
        where["role"] = filters.role;
    if (filters.department) {
        where["department"] = { contains: filters.department, mode: "insensitive" };
    }
    if (filters.isActive !== undefined) {
        where["isActive"] = filters.isActive === "true";
    }
    return db_1.prisma.user.findMany({
        where,
        select: USER_SELECT,
        orderBy: { name: "asc" },
    });
}
async function findById(id) {
    const user = await db_1.prisma.user.findUnique({
        where: { id },
        select: {
            ...USER_SELECT,
            teamMembers: {
                include: {
                    team: { select: { id: true, name: true } },
                },
            },
        },
    });
    if (!user)
        throw new ApiError_1.ApiError(404, "User not found");
    return user;
}
async function create(data) {
    const existing = await db_1.prisma.user.findUnique({ where: { email: data.email } });
    if (existing)
        throw new ApiError_1.ApiError(409, "Email already in use");
    const hashedPassword = await bcrypt_1.default.hash(data.password, SALT_ROUNDS);
    return db_1.prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role,
            department: data.department,
            skills: data.skills ?? [],
        },
        select: USER_SELECT,
    });
}
async function update(id, data) {
    const existing = await db_1.prisma.user.findUnique({ where: { id } });
    if (!existing)
        throw new ApiError_1.ApiError(404, "User not found");
    if (data.email && data.email !== existing.email) {
        const taken = await db_1.prisma.user.findUnique({ where: { email: data.email } });
        if (taken)
            throw new ApiError_1.ApiError(409, "Email already in use");
    }
    return db_1.prisma.user.update({
        where: { id },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.email !== undefined && { email: data.email }),
            ...(data.role !== undefined && { role: data.role }),
            ...(data.department !== undefined && { department: data.department }),
            ...(data.skills !== undefined && { skills: data.skills }),
            ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
        select: USER_SELECT,
    });
}
async function changePassword(id, password) {
    const existing = await db_1.prisma.user.findUnique({ where: { id } });
    if (!existing)
        throw new ApiError_1.ApiError(404, "User not found");
    const hashed = await bcrypt_1.default.hash(password, SALT_ROUNDS);
    await db_1.prisma.user.update({ where: { id }, data: { password: hashed } });
}
async function remove(id) {
    const existing = await db_1.prisma.user.findUnique({ where: { id } });
    if (!existing)
        throw new ApiError_1.ApiError(404, "User not found");
    await db_1.prisma.user.delete({ where: { id } });
}
exports.userService = { list, findById, create, update, changePassword, remove };
//# sourceMappingURL=user.service.js.map