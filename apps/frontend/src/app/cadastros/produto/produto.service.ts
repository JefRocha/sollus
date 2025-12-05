const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
import { apiFetch as coreApiFetch, isErrorResult } from "@/lib/api";

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

async function apiFetch(path: string, init?: RequestInit) {
  const url = joinUrl(API_URL, path);
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Falha ao requisitar ${path}: ${res.status} ${res.statusText}${
        text ? ` - ${text}` : ""
      }`
    );
  }
  return res.json();
}

export async function produtoGetById(id: number) {
  const r = await coreApiFetch<any>([
    `/produto/${id}`,
    `/produtos/${id}`,
    `/api/produto/${id}`,
    `/cadastros/produto/${id}`,
  ], { suppressErrorLog: true });
  if (isErrorResult(r)) {
    return { id, nome: "", valorCompra: 0, valorVenda: 0 };
  }
  return r;
}

export async function produtoCreate(payload: any) {
  return coreApiFetch<any>([
    `/produto`,
    `/produtos`,
    `/api/produto`,
    `/cadastros/produto`,
  ], { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), suppressErrorLog: true });
}

export async function produtoUpdate(payload: any) {
  return coreApiFetch<any>([
    `/produto/${payload.id}`,
    `/produtos/${payload.id}`,
    `/api/produto/${payload.id}`,
    `/cadastros/produto/${payload.id}`,
  ], { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), suppressErrorLog: true });
}

export async function produtoList(q?: string) {
  const field = "nome";
  const filter = q ? `?filter=${field}||$cont||${encodeURIComponent(q)}` : "";
  const data = await coreApiFetch<any>([
    `/produto${filter}`,
    `/produtos${filter}`,
    `/api/produto${filter}`,
    `/cadastros/produto${filter}`,
  ], { suppressErrorLog: true });
  return data;
}
