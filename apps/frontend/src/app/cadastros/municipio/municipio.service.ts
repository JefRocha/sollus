const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`.replace(/\/\/+/, "/"), init);
  if (!res.ok) throw new Error(`Falha ao requisitar ${path}`);
  return res.json();
}

export async function municipioGetById(id: number) {
  return apiFetch(`/municipio/${id}`);
}

export async function municipioCreate(payload: any) {
  return apiFetch(`/municipio`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}

export async function municipioUpdate(payload: any) {
  return apiFetch(`/municipio/${payload.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}

