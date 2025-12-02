const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`.replace(/\/\/+/, "/"), init);
  if (!res.ok) throw new Error(`Falha ao requisitar ${path}`);
  return res.json();
}

export async function produtoGetById(id: number) {
  return apiFetch(`/produto/${id}`);
}

export async function produtoCreate(payload: any) {
  return apiFetch(`/produto`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}

export async function produtoUpdate(payload: any) {
  return apiFetch(`/produto/${payload.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}

export async function produtoList(q?: string) {
  const field = "nome";
  const filter = q ? `?filter=${field}||$cont||${encodeURIComponent(q)}` : "";
  return apiFetch(`/produto${filter}`);
}

