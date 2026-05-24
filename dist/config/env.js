"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const frontendUrls = [
    process.env["FRONTEND_URL"],
    process.env["FRONTEND_URLS"],
    "http://localhost:3000",
]
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim().replace(/\/$/, ""))
    .filter(Boolean);
exports.env = {
    nodeEnv: process.env["NODE_ENV"] ?? "development",
    port: parseInt(process.env["PORT"] ?? "5000", 10),
    databaseUrl: process.env["DATABASE_URL"] ?? "",
    jwtAccessSecret: process.env["JWT_ACCESS_SECRET"] ?? "fallback-access-secret-change-in-prod",
    jwtRefreshSecret: process.env["JWT_REFRESH_SECRET"] ?? "fallback-refresh-secret-change-in-prod",
    jwtAccessExpiresIn: process.env["JWT_ACCESS_EXPIRES_IN"] ?? "15m",
    jwtRefreshExpiresIn: process.env["JWT_REFRESH_EXPIRES_IN"] ?? "7d",
    frontendUrl: process.env["FRONTEND_URL"] ?? "http://localhost:3000",
    frontendUrls,
};
//# sourceMappingURL=env.js.map