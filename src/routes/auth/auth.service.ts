import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/db";
import { env } from "../../config/env";
import { ApiError } from "../../utils/ApiError";
import type { RegisterInput, LoginInput } from "./auth.schema";

const SALT_ROUNDS = 12;

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

function generateTokens(userId: string, role: string): TokenPair {
  const accessToken = jwt.sign(
    { userId, role },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpiresIn } as jwt.SignOptions
  );
  const refreshToken = jwt.sign(
    { userId, role },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpiresIn } as jwt.SignOptions
  );
  return { accessToken, refreshToken };
}

function refreshExpiryDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
}

export async function register(data: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new ApiError(409, "Email already in use");

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
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
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt: refreshExpiryDate() },
  });

  return { user, accessToken, refreshToken };
}

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user || !user.isActive) throw new ApiError(401, "Invalid credentials");

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = generateTokens(user.id, user.role);
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt: refreshExpiryDate() },
  });

  const { password: _pw, ...safeUser } = user;
  return { user: safeUser, accessToken, refreshToken };
}

export async function refreshTokens(token: string): Promise<TokenPair> {
  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.expiresAt < new Date()) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  interface JwtPayload { userId: string; role: string }
  const payload = jwt.verify(token, env.jwtRefreshSecret) as JwtPayload;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, role: true, isActive: true },
  });
  if (!user || !user.isActive) throw new ApiError(401, "User not found or inactive");

  await prisma.refreshToken.delete({ where: { token } });

  const tokens = generateTokens(user.id, user.role);
  await prisma.refreshToken.create({
    data: { token: tokens.refreshToken, userId: user.id, expiresAt: refreshExpiryDate() },
  });

  return tokens;
}

export async function logout(token: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { token } }).catch(() => undefined);
}

export async function getMe(userId: string) {
  return prisma.user.findUnique({
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
