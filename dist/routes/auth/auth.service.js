"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refreshTokens = refreshTokens;
exports.logout = logout;
exports.getMe = getMe;
exports.listUsers = listUsers;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../config/db");
const env_1 = require("../../config/env");
const ApiError_1 = require("../../utils/ApiError");
const SALT_ROUNDS = 12;
function generateTokens(userId, role) {
    const accessToken = jsonwebtoken_1.default.sign({ userId, role }, env_1.env.jwtAccessSecret, { expiresIn: env_1.env.jwtAccessExpiresIn });
    const refreshToken = jsonwebtoken_1.default.sign({ userId, role }, env_1.env.jwtRefreshSecret, { expiresIn: env_1.env.jwtRefreshExpiresIn });
    return { accessToken, refreshToken };
}
function refreshExpiryDate() {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
}
async function register(data) {
    const existing = await db_1.prisma.user.findUnique({ where: { email: data.email } });
    if (existing)
        throw new ApiError_1.ApiError(409, "Email already in use");
    const hashedPassword = await bcrypt_1.default.hash(data.password, SALT_ROUNDS);
    const user = await db_1.prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            isActive: true,
            createdAt: true,
        },
    });
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    await db_1.prisma.refreshToken.create({
        data: { token: refreshToken, userId: user.id, expiresAt: refreshExpiryDate() },
    });
    return { user, accessToken, refreshToken };
}
async function login(data) {
    const user = await db_1.prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.isActive)
        throw new ApiError_1.ApiError(401, "Invalid credentials");
    const isMatch = await bcrypt_1.default.compare(data.password, user.password);
    if (!isMatch)
        throw new ApiError_1.ApiError(401, "Invalid credentials");
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    await db_1.prisma.refreshToken.create({
        data: { token: refreshToken, userId: user.id, expiresAt: refreshExpiryDate() },
    });
    const { password: _pw, ...safeUser } = user;
    return { user: safeUser, accessToken, refreshToken };
}
async function refreshTokens(token) {
    const stored = await db_1.prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
        throw new ApiError_1.ApiError(401, "Invalid or expired refresh token");
    }
    const payload = jsonwebtoken_1.default.verify(token, env_1.env.jwtRefreshSecret);
    const user = await db_1.prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, role: true, isActive: true },
    });
    if (!user || !user.isActive)
        throw new ApiError_1.ApiError(401, "User not found or inactive");
    await db_1.prisma.refreshToken.delete({ where: { token } });
    const tokens = generateTokens(user.id, user.role);
    await db_1.prisma.refreshToken.create({
        data: { token: tokens.refreshToken, userId: user.id, expiresAt: refreshExpiryDate() },
    });
    return tokens;
}
async function logout(token) {
    await db_1.prisma.refreshToken.deleteMany({ where: { token } }).catch(() => undefined);
}
async function getMe(userId) {
    return db_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}
async function listUsers() {
    return db_1.prisma.user.findMany({
        where: { isActive: true },
        select: { id: true, name: true, email: true, role: true },
        orderBy: { name: "asc" },
    });
}
//# sourceMappingURL=auth.service.js.map