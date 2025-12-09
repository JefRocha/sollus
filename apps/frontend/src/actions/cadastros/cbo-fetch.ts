"use server";

import { apiServerAction } from "@/lib/api-server-action";
import { Cbo } from "@/app/cadastros/cbo/cbo.service";

// Tenta rotas comuns
async function tryEndpoints<T>(
  action: (prefix: string) => Promise<T>,
  prefixes = ["/api/cbo", "/cadastros/cbo", "/cbo"]
): Promise<T> {
  let lastError: any;
  for (const prefix of prefixes) {
    try {
      return await action(prefix);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

export async function getCbosServer(): Promise<Cbo[]> {
  return tryEndpoints(async (endpoint) => {
    const res = await apiServerAction<any>(endpoint);
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  });
}

export async function getCboByIdServer(id: number): Promise<Cbo> {
  return tryEndpoints((endpoint) => apiServerAction<Cbo>(`${endpoint}/${id}`));
}

export async function createCboServer(data: any): Promise<Cbo> {
  return tryEndpoints((endpoint) =>
    apiServerAction<Cbo>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  );
}

export async function updateCboServer(id: number, data: any): Promise<Cbo> {
  return tryEndpoints((endpoint) =>
    apiServerAction<Cbo>(`${endpoint}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  );
}
