import type { Request, Response } from "express";
import type { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { getSessionFromCookieHeader, type SessionUser } from "@/server/auth/session";

export function getRequestSessionUser(request: Request) {
  return getSessionFromCookieHeader(request.headers.cookie);
}

export function requireRequestUser(request: Request, response: Response) {
  const user = getRequestSessionUser(request);

  if (!user) {
    response.status(401).json({ error: "Authentication required." });
    return null;
  }

  return user;
}

export function requireRequestRole(
  request: Request,
  response: Response,
  roles: Role[]
): SessionUser | null {
  const user = requireRequestUser(request, response);

  if (!user) {
    return null;
  }

  if (!roles.includes(user.role)) {
    response.status(403).json({ error: "You do not have access to this resource." });
    return null;
  }

  return user;
}

export async function getCurrentSessionUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("mandala_session");

  return getSessionFromCookieHeader(
    sessionCookie ? `${sessionCookie.name}=${sessionCookie.value}` : undefined
  );
}

export async function requirePageUser() {
  const user = await getCurrentSessionUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  return user;
}

export async function requirePageRole(roles: Role[]) {
  const user = await requirePageUser();

  if (!roles.includes(user.role)) {
    redirect("/account");
  }

  return user;
}
