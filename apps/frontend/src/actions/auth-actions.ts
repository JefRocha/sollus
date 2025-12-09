"use server";

import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { cookies } from "next/headers";

const loginSchema = z.object({
  login: z.string().min(1, "Login é obrigatório"),
  senha: z.string().min(1, "Senha é obrigatória"),
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const loginAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput }) => {
    try {
      // Backend URL (localhost para server-to-server)
      // Força HTTP e localhost para evitar erros de certificado em dev
      let baseUrl = API_URL.replace("127.0.0.1", "localhost");
      if (baseUrl.startsWith("https://localhost")) {
        baseUrl = baseUrl.replace("https://", "http://");
      }
      
      console.log(`[LoginAction] Fetching: ${baseUrl}/api/auth/login`);

      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Connection": "close"
        },
        body: JSON.stringify(parsedInput),
        cache: "no-store"
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
            throw new Error("Usuário ou senha inválidos");
        }
        throw new Error(`Erro no login: ${res.status}`);
      }

      const data = await res.json();
      const accessToken = data.token || data.access_token || data.accessToken || data.jwt || data.data?.token;
      const refreshToken = data.refreshToken || data.refresh_token || data.data?.refresh;

      if (!accessToken) {
        throw new Error("Token não retornado pelo servidor");
      }

      // SETAR COOKIE NO NEXT.JS (DOMÍNIO LOCALHOST:3000)
      const cookieStore = await cookies();
      
      // Cookie HttpOnly acessível apenas pelo servidor (segurança máxima)
      cookieStore.set("sollus_access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // False em dev
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 24h
      });

      if (refreshToken) {
        cookieStore.set("sollus_refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 dias
        });
      }

      // Retorna o token também para o client salvar no localStorage (compatibilidade híbrida)
      return { success: true, token: accessToken, refreshToken };
    } catch (error: any) {
      console.error("Login Action Error:", error);
      return { success: false, error: error.message || "Erro desconhecido no login" };
    }
  });
