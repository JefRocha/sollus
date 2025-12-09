"use server";

import { apiFetchServer } from "@/lib/api-server";
import { isErrorResult } from "@/lib/api";
import { cookies } from "next/headers";
import { Cbo } from "@/app/cadastros/cbo/cbo.service";

async function getApiCtx() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sollus_access_token")?.value;
  const xsrfToken =
    cookieStore.get("XSRF-TOKEN")?.value ||
    cookieStore.get("sollus_csrf_token")?.value;
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return {
    accessToken: token,
    xsrfToken,
    cookieHeader,
  };
}

export async function getCbosServer(): Promise<Cbo[]> {
  const ctx = await getApiCtx();
  const data: any = await apiFetchServer<Cbo[]>(
    `/cadastros/cbo`,
    { suppressErrorLog: true },
    ctx
  );

  if (isErrorResult(data)) {
    const data2: any = await apiFetchServer<Cbo[]>(
      `/api/cbo`,
      { suppressErrorLog: true },
      ctx
    );
    if (!isErrorResult(data2)) {
      if (data2 && Array.isArray(data2.data)) return data2.data;
      return Array.isArray(data2) ? data2 : [];
    }

    const data3: any = await apiFetchServer<Cbo[]>(
      `/cbo`,
      { suppressErrorLog: true },
      ctx
    );
    if (!isErrorResult(data3)) {
      if (data3 && Array.isArray(data3.data)) return data3.data;
      return Array.isArray(data3) ? data3 : [];
    }

    return [];
  }

  if (data && Array.isArray(data.data)) return data.data;
  return Array.isArray(data) ? data : [];
}

export async function getCboByIdServer(id: number): Promise<Cbo> {
  const ctx = await getApiCtx();
  const data = await apiFetchServer<Cbo>(
    `/cadastros/cbo/${id}`,
    { suppressErrorLog: true },
    ctx
  );

  // Fallback paths if default fails
  if (isErrorResult(data)) {
    const data2 = await apiFetchServer<Cbo>(
      `/api/cbo/${id}`,
      { suppressErrorLog: true },
      ctx
    );
    if (!isErrorResult(data2)) return data2;

    const data3 = await apiFetchServer<Cbo>(
      `/cbo/${id}`,
      { suppressErrorLog: true },
      ctx
    );
    if (!isErrorResult(data3)) return data3;

    throw new Error("Falha ao buscar CBO");
  }
  return data;
}

export async function createCboServer(data: any): Promise<Cbo> {
  const ctx = await getApiCtx();
  const res = await apiFetchServer<Cbo>(
    `/cadastros/cbo`,
    {
      method: "POST",
      body: JSON.stringify(data),
      suppressErrorLog: true,
    },
    ctx
  );

  if (isErrorResult(res)) {
    // Fallback
    const res2 = await apiFetchServer<Cbo>(
      `/api/cbo`,
      {
        method: "POST",
        body: JSON.stringify(data),
        suppressErrorLog: true,
      },
      ctx
    );
    if (!isErrorResult(res2)) return res2;
    throw new Error("Erro ao criar CBO");
  }
  return res;
}

export async function updateCboServer(id: number, data: any): Promise<Cbo> {
  const ctx = await getApiCtx();
  const res = await apiFetchServer<Cbo>(
    `/cadastros/cbo/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      suppressErrorLog: true,
    },
    ctx
  );

  if (isErrorResult(res)) {
    // Fallback
    const res2 = await apiFetchServer<Cbo>(
      `/api/cbo/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        suppressErrorLog: true,
      },
      ctx
    );
    if (!isErrorResult(res2)) return res2;
    throw new Error("Erro ao atualizar CBO");
  }
  return res;
}
