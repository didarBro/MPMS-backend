import bcrypt from "bcrypt";
import { prisma } from "../../config/db";
import { ApiError } from "../../utils/ApiError";
import type { CreateUserInput, UpdateUserInput } from "./user.schema";

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

async function list(filters: {
  search?: string;
  role?: string;
  department?: string;
  isActive?: string;
}) {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where["OR"] = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters.role) where["role"] = filters.role;
  if (filters.department) {
    where["department"] = { contains: filters.department, mode: "insensitive" };
  }
  if (filters.isActive !== undefined) {
    where["isActive"] = filters.isActive === "true";
  }

  return prisma.user.findMany({
    where,
    select: USER_SELECT,
    orderBy: { name: "asc" },
  });
}

async function findById(id: string) {
  const user = await prisma.user.findUnique({
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
  if (!user) throw new ApiError(404, "User not found");
  return user;
}

async function create(data: CreateUserInput) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new ApiError(409, "Email already in use");

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  return prisma.user.create({
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

async function update(id: string, data: UpdateUserInput) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "User not found");

  if (data.email && data.email !== existing.email) {
    const taken = await prisma.user.findUnique({ where: { email: data.email } });
    if (taken) throw new ApiError(409, "Email already in use");
  }

  return prisma.user.update({
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

async function changePassword(id: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "User not found");
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  await prisma.user.update({ where: { id }, data: { password: hashed } });
}

async function remove(id: string) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "User not found");
  await prisma.user.delete({ where: { id } });
}

export const userService = { list, findById, create, update, changePassword, remove };
