import { z } from "zod";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function normalizeList(json: any) {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.content)) return json.content;
  return [];
}

export async function getSindicatos(input: { q?: string; field?: string } = {}) {
  if (!API_URL) return { sindicatos: [], error: "NEXT_PUBLIC_API_URL não definido" };
  const q = input.q?.trim();
  const field = input.field || "nome";
  const base = `?page=1&limit=100`;
  const filter = q
    ? q.includes("$cont") || q.includes("$eq") || q.includes("$between")
      ? `${base}&filter=${encodeURIComponent(q)}`
      : `${base}&filter=${field}||$cont||${encodeURIComponent(q)}`
    : base;
  try {
    const res = await fetch(`${API_URL}/sindicato${filter}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao carregar sindicatos");
    const json = await res.json();
    return { sindicatos: normalizeList(json) };
  } catch (e: any) {
    return { sindicatos: [], error: e?.message || "Erro ao buscar sindicatos" };
  }
}

export async function getSindicatoById(id: number) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  try {
    const res = await fetch(`${API_URL}/sindicato/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao carregar sindicato");
    const json = await res.json();
    return { sindicato: json.data || json };
  } catch (e: any) {
    return { error: e?.message || "Erro ao carregar sindicato" };
  }
}

export async function createSindicato(payload: any) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  const schema = z.object({ nome: z.string({ message: "Nome obrigatório" }).min(1, { message: "Nome obrigatório" }), observacao: z.string().optional() });
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues.map((e) => e.message).join(", ") };
  try {
    const res = await fetch(`${API_URL}/sindicato`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
    if (!res.ok) throw new Error("Falha ao criar sindicato");
    return { sindicato: await res.json() };
  } catch (e: any) {
    return { error: e?.message || "Erro ao criar sindicato" };
  }
}

export async function updateSindicato(payload: any) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  const schema = z.object({ id: z.number().min(1, { message: "ID inválido" }), nome: z.string({ message: "Nome obrigatório" }).min(1, { message: "Nome obrigatório" }), observacao: z.string().optional() });
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues.map((e) => e.message).join(", ") };
  try {
    const res = await fetch(`${API_URL}/sindicato/${parsed.data.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
    if (!res.ok) throw new Error("Falha ao atualizar sindicato");
    return { sindicato: await res.json() };
  } catch (e: any) {
    return { error: e?.message || "Erro ao atualizar sindicato" };
  }
}

export async function deleteSindicato(id: number) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  try {
    const res = await fetch(`${API_URL}/sindicato/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Falha ao excluir sindicato");
    return { success: true };
  } catch (e: any) {
    return { error: e?.message || "Erro ao excluir sindicato" };
  }
}

