"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = exports.getMe = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const response_1 = require("../../utils/response");
const authService = __importStar(require("./auth.service"));
const env_1 = require("../../config/env");
const ACCESS_TTL = 15 * 60 * 1000;
const REFRESH_TTL = 7 * 24 * 60 * 60 * 1000;
const COOKIE_BASE = {
    httpOnly: true,
    secure: env_1.env.nodeEnv === "production",
    sameSite: "lax",
};
function setAuthCookies(res, accessToken, refreshToken, role) {
    res.cookie("access_token", accessToken, { ...COOKIE_BASE, maxAge: ACCESS_TTL });
    res.cookie("refresh_token", refreshToken, { ...COOKIE_BASE, maxAge: REFRESH_TTL });
    res.cookie("user_role", role, {
        httpOnly: false,
        secure: env_1.env.nodeEnv === "production",
        sameSite: "lax",
        maxAge: ACCESS_TTL,
    });
}
function clearAuthCookies(res) {
    res.clearCookie("access_token", COOKIE_BASE);
    res.clearCookie("refresh_token", COOKIE_BASE);
    res.clearCookie("user_role");
}
exports.register = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    setAuthCookies(res, accessToken, refreshToken, user.role);
    (0, response_1.sendSuccess)(res, { user, accessToken }, "Registration successful", 201);
});
exports.login = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    setAuthCookies(res, accessToken, refreshToken, user.role);
    (0, response_1.sendSuccess)(res, { user, accessToken }, "Login successful");
});
exports.refresh = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const token = req.cookies["refresh_token"];
    if (!token) {
        res.status(401).json({ success: false, message: "Refresh token not found" });
        return;
    }
    const { accessToken, refreshToken, role } = await authService.refreshTokens(token);
    setAuthCookies(res, accessToken, refreshToken, role);
    (0, response_1.sendSuccess)(res, { accessToken }, "Token refreshed");
});
exports.logout = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const token = req.cookies["refresh_token"];
    if (token)
        await authService.logout(token);
    clearAuthCookies(res);
    (0, response_1.sendSuccess)(res, null, "Logged out successfully");
});
exports.getMe = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await authService.getMe(req.user.id);
    (0, response_1.sendSuccess)(res, { user }, "User fetched");
});
exports.listUsers = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const users = await authService.listUsers();
    (0, response_1.sendSuccess)(res, users, "Users fetched");
});
//# sourceMappingURL=auth.controller.js.map