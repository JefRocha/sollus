import { z } from "zod";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function normalizeList(json: any) {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.content)) return json.content;
  return [];
}

export async function getSetores(input: { q?: string; field?: string } = {}) {
  if (!API_URL) return { setores: [], error: "NEXT_PUBLIC_API_URL não definido" };
  const q = input.q?.trim();
  const field = input.field || "nome";
  const base = `?page=1&limit=100`;
  const filter = q
    ? q.includes("$cont") || q.includes("$eq") || q.includes("$between")
      ? `${base}&filter=${encodeURIComponent(q)}`
      : `${base}&filter=${field}||$cont||${encodeURIComponent(q)}`
    : base;
  try {
    const res = await fetch(`${API_URL}/setor${filter}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao carregar setores");
    const json = await res.json();
    return { setores: normalizeList(json) };
  } catch (e: any) {
    return { setores: [], error: e?.message || "Erro ao buscar setores" };
  }
}

export async function getSetorById(id: number) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  try {
    const res = await fetch(`${API_URL}/setor/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao carregar setor");
    const json = await res.json();
    return { setor: json.data || json };
  } catch (e: any) {
    return { error: e?.message || "Erro ao carregar setor" };
  }
}

export async function createSetor(payload: any) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  const schema = z.object({ nome: z.string({ message: "Nome obrigatório" }).min(1, { message: "Nome obrigatório" }), descricao: z.string().optional() });
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues.map((e) => e.message).join(", ") };
  try {
    const res = await fetch(`${API_URL}/setor`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
    if (!res.ok) throw new Error("Falha ao criar setor");
    return { setor: await res.json() };
  } catch (e: any) {
    return { error: e?.message || "Erro ao criar setor" };
  }
}

export async function updateSetor(payload: any) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  const schema = z.object({ id: z.number().min(1, { message: "ID inválido" }), nome: z.string({ message: "Nome obrigatório" }).min(1, { message: "Nome obrigatório" }), descricao: z.string().optional() });
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues.map((e) => e.message).join(", ") };
  try {
    const res = await fetch(`${API_URL}/setor/${parsed.data.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
    if (!res.ok) throw new Error("Falha ao atualizar setor");
    return { setor: await res.json() };
  } catch (e: any) {
    return { error: e?.message || "Erro ao atualizar setor" };
  }
}

export async function deleteSetor(id: number) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  try {
    const res = await fetch(`${API_URL}/setor/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Falha ao excluir setor");
    return { success: true };
  } catch (e: any) {
    return { error: e?.message || "Erro ao excluir setor" };
  }
}

