import dotenv from "dotenv";
dotenv.config();

export const env = {
  nodeEnv: process.env["NODE_ENV"] ?? "development",
  port: parseInt(process.env["PORT"] ?? "5000", 10),
  databaseUrl: process.env["DATABASE_URL"] ?? "",
  jwtAccessSecret: process.env["JWT_ACCESS_SECRET"] ?? "fallback-access-secret-change-in-prod",
  jwtRefreshSecret: process.env["JWT_REFRESH_SECRET"] ?? "fallback-refresh-secret-change-in-prod",
  jwtAccessExpiresIn: process.env["JWT_ACCESS_EXPIRES_IN"] ?? "15m",
  jwtRefreshExpiresIn: process.env["JWT_REFRESH_EXPIRES_IN"] ?? "7d",
  frontendUrl: process.env["FRONTEND_URL"] ?? "http://localhost:3000",
};
