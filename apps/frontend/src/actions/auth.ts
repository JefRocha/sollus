"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import { apiFetch } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  login: z.string().min(1, "Login é obrigatório"),
  senha: z.string().min(1, "Senha é obrigatória"),
});

export const loginAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput: { login, senha } }) => {
    try {
      const r = await apiFetch<any>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ login, senha }),
        suppressErrorLog: true,
      });
      if (r && (r.__unauthorized || r.__error)) {
        return { success: false, error: "Usuário ou senha inválidos" };
      }
      const access =
        r?.token ??
        r?.access_token ??
        r?.accessToken ??
        r?.jwt ??
        r?.data?.token;
      const refresh = r?.refreshToken ?? r?.refresh_token ?? r?.data?.refresh;
      try {
        const store = await cookies();
        if (access) {
          store.set("sollus_access_token", access, {
            httpOnly: true,
            path: "/",
            maxAge: 3600,
          });
        }
        if (refresh) {
          store.set("sollus_refresh_token", refresh, {
            httpOnly: true,
            path: "/",
            maxAge: 7 * 24 * 3600,
          });
        }
      } catch {}
      return { success: true, token: access, refreshToken: refresh };
    } catch (error: any) {
      return { success: false, error: "Usuário ou senha inválidos" };
    }
  });

export const logoutAction = actionClient.action(async () => {
  try {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://localhost:4000";
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch {}
    const cookieStore = await cookies();
    cookieStore.delete("sollus_access_token");
    cookieStore.delete("sollus_refresh_token");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao fazer logout" };
  }
});
