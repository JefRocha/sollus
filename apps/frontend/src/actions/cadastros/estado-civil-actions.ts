import { z } from "zod";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function normalizeList(json: any) {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.content)) return json.content;
  return [];
}

export async function getEstadosCivis(input: { q?: string; field?: string } = {}) {
  if (!API_URL) return { estados: [], error: "NEXT_PUBLIC_API_URL não definido" };
  const q = input.q?.trim();
  const field = input.field || "nome";
  const base = `?page=1&limit=100`;
  const filter = q
    ? q.includes("$cont") || q.includes("$eq") || q.includes("$between")
      ? `${base}&filter=${encodeURIComponent(q)}`
      : `${base}&filter=${field}||$cont||${encodeURIComponent(q)}`
    : base;
  try {
    const res = await fetch(`${API_URL}/estado-civil${filter}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao carregar estados civis");
    const json = await res.json();
    return { estados: normalizeList(json) };
  } catch (e: any) {
    return { estados: [], error: e?.message || "Erro ao buscar estados civis" };
  }
}

export async function getEstadoCivilById(id: number) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  try {
    const res = await fetch(`${API_URL}/estado-civil/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao carregar estado civil");
    const json = await res.json();
    const estado = Array.isArray(json)
      ? json[0]
      : (typeof json?.data === "object" && json?.data !== null)
        ? json.data
        : json;
    return { estado };
  } catch (e: any) {
    return { error: e?.message || "Erro ao carregar estado civil" };
  }
}

export async function createEstadoCivil(payload: any) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  const schema = z.object({ nome: z.string({ message: "Nome obrigatório" }).min(1, { message: "Nome obrigatório" }), descricao: z.string().optional() });
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues.map((e) => e.message).join(", ") };
  try {
    const res = await fetch(`${API_URL}/estado-civil`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
    if (!res.ok) throw new Error("Falha ao criar estado civil");
    return { estado: await res.json() };
  } catch (e: any) {
    return { error: e?.message || "Erro ao criar estado civil" };
  }
}

export async function updateEstadoCivil(payload: any) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  const schema = z.object({ id: z.number().min(1, { message: "ID inválido" }), nome: z.string({ message: "Nome obrigatório" }).min(1, { message: "Nome obrigatório" }), descricao: z.string().optional() });
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues.map((e) => e.message).join(", ") };
  try {
    const res = await fetch(`${API_URL}/estado-civil/${parsed.data.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
    if (!res.ok) throw new Error("Falha ao atualizar estado civil");
    return { estado: await res.json() };
  } catch (e: any) {
    return { error: e?.message || "Erro ao atualizar estado civil" };
  }
}

export async function deleteEstadoCivil(id: number) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  try {
    const res = await fetch(`${API_URL}/estado-civil/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Falha ao excluir estado civil");
    return { success: true };
  } catch (e: any) {
    return { error: e?.message || "Erro ao excluir estado civil" };
  }
}

