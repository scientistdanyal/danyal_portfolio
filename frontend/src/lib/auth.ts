"use client";

import { api } from "./api";

export type AdminUser = {
  id: string;
  email: string;
};

export async function login(email: string, password: string) {
  return api<{ user: AdminUser }>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function logout() {
  return api<void>("/api/auth/logout", { method: "POST" });
}

export async function getMe() {
  return api<{ user: AdminUser }>("/api/auth/me");
}
