import { z } from "zod";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function normalizeList(json: any) {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.content)) return json.content;
  return [];
}

export async function getTiposAdmissao(input: { q?: string; field?: string } = {}) {
  if (!API_URL) return { tipos: [], error: "NEXT_PUBLIC_API_URL não definido" };
  const q = input.q?.trim();
  const field = input.field || "nome";
  const base = `?page=1&limit=100`;
  const filter = q
    ? q.includes("$cont") || q.includes("$eq") || q.includes("$between")
      ? `${base}&filter=${encodeURIComponent(q)}`
      : `${base}&filter=${field}||$cont||${encodeURIComponent(q)}`
    : base;
  try {
    const res = await fetch(`${API_URL}/tipo-admissao${filter}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao carregar tipos de admissão");
    const json = await res.json();
    return { tipos: normalizeList(json) };
  } catch (e: any) {
    return { tipos: [], error: e?.message || "Erro ao buscar tipos de admissão" };
  }
}

export async function getTipoAdmissaoById(id: number) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  try {
    const res = await fetch(`${API_URL}/tipo-admissao/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao carregar tipo de admissão");
    const json = await res.json();
    return { tipo: json.data || json };
  } catch (e: any) {
    return { error: e?.message || "Erro ao carregar tipo de admissão" };
  }
}

export async function createTipoAdmissao(payload: any) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  const schema = z.object({ nome: z.string({ message: "Nome obrigatório" }).min(1, { message: "Nome obrigatório" }), observacao: z.string().optional() });
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues.map((e) => e.message).join(", ") };
  try {
    const res = await fetch(`${API_URL}/tipo-admissao`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
    if (!res.ok) throw new Error("Falha ao criar tipo de admissão");
    return { tipo: await res.json() };
  } catch (e: any) {
    return { error: e?.message || "Erro ao criar tipo de admissão" };
  }
}

export async function updateTipoAdmissao(payload: any) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  const schema = z.object({ id: z.number().min(1, { message: "ID inválido" }), nome: z.string({ message: "Nome obrigatório" }).min(1, { message: "Nome obrigatório" }), observacao: z.string().optional() });
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues.map((e) => e.message).join(", ") };
  try {
    const res = await fetch(`${API_URL}/tipo-admissao/${parsed.data.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
    if (!res.ok) throw new Error("Falha ao atualizar tipo de admissão");
    return { tipo: await res.json() };
  } catch (e: any) {
    return { error: e?.message || "Erro ao atualizar tipo de admissão" };
  }
}

export async function deleteTipoAdmissao(id: number) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  try {
    const res = await fetch(`${API_URL}/tipo-admissao/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Falha ao excluir tipo de admissão");
    return { success: true };
  } catch (e: any) {
    return { error: e?.message || "Erro ao excluir tipo de admissão" };
  }
}

