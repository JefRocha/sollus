const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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
  return apiFetch(`/produto/${id}`);
}

export async function produtoCreate(payload: any) {
  return apiFetch(`/produto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function produtoUpdate(payload: any) {
  return apiFetch(`/produto/${payload.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function produtoList(q?: string) {
  const field = "nome";
  const filter = q ? `?filter=${field}||$cont||${encodeURIComponent(q)}` : "";
  return apiFetch(`/produto${filter}`);
}
