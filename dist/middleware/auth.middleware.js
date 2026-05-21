"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const db_1 = require("../config/db");
const ApiError_1 = require("../utils/ApiError");
const catchAsync_1 = require("../utils/catchAsync");
exports.authenticate = (0, catchAsync_1.catchAsync)(async (req, _res, next) => {
    const token = req.cookies["access_token"] ??
        req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError_1.ApiError(401, "Authentication required");
    }
    const payload = jsonwebtoken_1.default.verify(token, env_1.env.jwtAccessSecret);
    const user = await db_1.prisma.user.findUnique({
        where: { id: payload.userId },
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
    if (!user || !user.isActive) {
        throw new ApiError_1.ApiError(401, "User not found or inactive");
    }
    req.user = user;
    next();
});
const authorize = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            next(new ApiError_1.ApiError(401, "Authentication required"));
            return;
        }
        if (!roles.includes(req.user.role)) {
            next(new ApiError_1.ApiError(403, "Insufficient permissions"));
            return;
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map