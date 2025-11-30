import { z } from "zod";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function normalizeList(json: any) {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.content)) return json.content;
  return [];
}

function principalLabel(v?: string) {
  return v === "S" ? "Sim" : v === "N" ? "Não" : "";
}

export async function getTabelasPreco(input: { q?: string; field?: string } = {}) {
  if (!API_URL) return { tabelas: [], error: "NEXT_PUBLIC_API_URL não definido" };
  const q = input.q?.trim();
  const field = input.field || "nome";
  const base = `?page=1&limit=100`;
  const filter = q
    ? q.includes("$cont") || q.includes("$eq") || q.includes("$between")
      ? `${base}&filter=${encodeURIComponent(q)}`
      : `${base}&filter=${field}||$cont||${encodeURIComponent(q)}`
    : base;
  try {
    const res = await fetch(`${API_URL}/tabela-preco${filter}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao carregar tabelas de preço");
    const json = await res.json();
    const list = normalizeList(json) as any[];
    const tabelas = list.map((r) => ({
      id: r.id,
      nome: r.nome,
      principal: r.principal,
      principal_label: principalLabel(r.principal),
      coeficiente: typeof r.coeficiente === "number" ? r.coeficiente : Number(r.coeficiente ?? 0),
    }));
    return { tabelas };
  } catch (e: any) {
    return { tabelas: [], error: e?.message || "Erro ao buscar tabelas de preço" };
  }
}

export async function getTabelaPrecoById(id: number) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  try {
    const res = await fetch(`${API_URL}/tabela-preco/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao carregar tabela de preço");
    const json = await res.json();
    const item = Array.isArray(json)
      ? json[0]
      : (typeof json?.data === "object" && json?.data !== null)
        ? json.data
        : json;
    const tabela = {
      id: item.id,
      nome: item.nome ?? "",
      principal: item.principal ?? "N",
      coeficiente: typeof item.coeficiente === "number" ? item.coeficiente : Number(item.coeficiente ?? 0),
    };
    return { tabela };
  } catch (e: any) {
    return { error: e?.message || "Erro ao carregar tabela de preço" };
  }
}

export async function createTabelaPreco(payload: any) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  const schema = z.object({
    nome: z.string({ message: "Nome obrigatório" }).min(1, { message: "Nome obrigatório" }).max(100, { message: "Nome até 100 caracteres" }),
    principal: z.enum(["S", "N"]).default("N"),
    coeficiente: z.number().or(z.string()).transform((v) => Number(v)).refine((v) => !Number.isNaN(v), { message: "Coeficiente inválido" }),
  });
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues.map((e) => e.message).join(", ") };
  try {
    const res = await fetch(`${API_URL}/tabela-preco`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
    if (!res.ok) throw new Error("Falha ao criar tabela de preço");
    return { tabela: await res.json() };
  } catch (e: any) {
    return { error: e?.message || "Erro ao criar tabela de preço" };
  }
}

export async function updateTabelaPreco(payload: any) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  const schema = z.object({
    id: z.number().min(1, { message: "ID inválido" }),
    nome: z.string({ message: "Nome obrigatório" }).min(1, { message: "Nome obrigatório" }).max(100, { message: "Nome até 100 caracteres" }),
    principal: z.enum(["S", "N"]).default("N"),
    coeficiente: z.number().or(z.string()).transform((v) => Number(v)).refine((v) => !Number.isNaN(v), { message: "Coeficiente inválido" }),
  });
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.issues.map((e) => e.message).join(", ") };
  try {
    const res = await fetch(`${API_URL}/tabela-preco/${parsed.data.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
    if (!res.ok) throw new Error("Falha ao atualizar tabela de preço");
    return { tabela: await res.json() };
  } catch (e: any) {
    return { error: e?.message || "Erro ao atualizar tabela de preço" };
  }
}

export async function deleteTabelaPreco(id: number) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  try {
    const res = await fetch(`${API_URL}/tabela-preco/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Falha ao excluir tabela de preço");
    return { success: true };
  } catch (e: any) {
    return { error: e?.message || "Erro ao excluir tabela de preço" };
  }
}

