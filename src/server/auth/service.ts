import type { Role } from "@prisma/client";

import { prisma } from "@/server/db";
import { hashPassword, verifyPassword } from "@/server/auth/password";

export class AuthServiceError extends Error {}

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type SignInInput = {
  email: string;
  password: string;
};

function resolveRoleForEmail(email: string): Role {
  const adminEmails = (process.env.AUTH_ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  const stylistEmails = (process.env.AUTH_STYLIST_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.includes(email.toLowerCase())) {
    return "ADMIN";
  }

  if (stylistEmails.includes(email.toLowerCase())) {
    return "STYLIST";
  }

  return "USER";
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email.toLowerCase()
    }
  });

  if (existingUser) {
    throw new AuthServiceError("An account with this email already exists.");
  }

  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email: input.email.toLowerCase(),
      passwordHash: await hashPassword(input.password),
      role: resolveRoleForEmail(input.email)
    }
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export async function authenticateUser(input: SignInInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email.toLowerCase()
    }
  });

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(input.password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}
