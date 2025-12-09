"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Fetch específico para uso dentro de Server Actions ("use server").
 * Ele pega o token automaticamente dos cookies (httpOnly) que chegam na requisição.
 */
export async function apiServerAction<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("sollus_access_token")?.value;
  
  if (!token) console.warn("[apiServerAction] Token not found in cookies!");
  else console.log("[apiServerAction] Token found, adding Authorization header");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    // Connection close ajuda a evitar problemas de socket em dev
    "Connection": "close", 
    ...options.headers,
  };

  if (token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

  // Remove barra inicial se houver
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  // Em comunicação Server-to-Server (Next -> Nest), evitamos SSL invalido usando localhost ou http se configurado
  // Se o backend for HTTPS auto-assinado, precisaremos de NODE_TLS_REJECT_UNAUTHORIZED=0 em dev
  let baseUrl = API_URL.replace("127.0.0.1", "localhost"); 
  if (baseUrl.startsWith("https://localhost")) {
    baseUrl = baseUrl.replace("https://", "http://");
  }

  console.log(`[ServerAction] ${options.method || 'GET'} ${baseUrl}${cleanEndpoint}`);

  const res = await fetch(`${baseUrl}${cleanEndpoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    let errorMessage = `Erro ${res.status}: ${res.statusText}`;
    try {
      const errorJson = await res.json();
      errorMessage = errorJson.message || errorMessage;
    } catch {}
    console.error(`[ServerAction Error] ${errorMessage}`);
    throw new Error(errorMessage);
  }

  if (res.status === 204) return null as T;

  return res.json();
}
