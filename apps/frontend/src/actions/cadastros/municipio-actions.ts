import { z } from "zod";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function normalizeList(json: any) {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.content)) return json.content;
  return [];
}

export async function getMunicipios(input: { q?: string; field?: string } = {}) {
  if (!API_URL) return { municipios: [], error: "NEXT_PUBLIC_API_URL não definido" };
  const q = input.q?.trim();
  const field = input.field || "nome";
  const base = `?page=1&limit=100`;
  const filter = q
    ? q.includes("$cont") || q.includes("$eq") || q.includes("$between")
      ? `${base}&filter=${encodeURIComponent(q)}`
      : `${base}&filter=${field}||$cont||${encodeURIComponent(q)}`
    : base;
  try {
    const res = await fetch(`${API_URL}/municipio${filter}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao carregar municípios");
    const json = await res.json();
    const list = normalizeList(json);
    const municipios = list.map((m: any) => ({
      id: m.id,
      nome: m.nome,
      codigoIbge: m.codigoIbge,
      uf: m.uf?.sigla || m.uf?.nome || "",
    }));
    return { municipios };
  } catch (e: any) {
    return { municipios: [], error: e?.message || "Erro ao buscar municípios" };
  }
}

export async function getMunicipioById(id: number) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  try {
    const res = await fetch(`${API_URL}/municipio/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao carregar município");
    const json = await res.json();
    const municipio = Array.isArray(json)
      ? json[0]
      : (typeof json?.data === "object" && json?.data !== null)
        ? json.data
        : json;
    return { municipio };
  } catch (e: any) {
    return { error: e?.message || "Erro ao carregar município" };
  }
}

export async function createMunicipio(payload: any) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  const schema = z.object({ nome: z.string().min(1), codigoIbge: z.number().or(z.string()).transform((v) => Number(v)), uf: z.string().min(2).max(2) });
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.errors.map((e) => e.message).join(", ") };
  try {
    const res = await fetch(`${API_URL}/municipio`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
    if (!res.ok) throw new Error("Falha ao criar município");
    return { municipio: await res.json() };
  } catch (e: any) {
    return { error: e?.message || "Erro ao criar município" };
  }
}

export async function updateMunicipio(payload: any) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  const schema = z.object({ id: z.number().min(1), nome: z.string().min(1), codigoIbge: z.number().or(z.string()).transform((v) => Number(v)), uf: z.string().min(2).max(2) });
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.errors.map((e) => e.message).join(", ") };
  try {
    const res = await fetch(`${API_URL}/municipio/${parsed.data.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
    if (!res.ok) throw new Error("Falha ao atualizar município");
    return { municipio: await res.json() };
  } catch (e: any) {
    return { error: e?.message || "Erro ao atualizar município" };
  }
}

export async function deleteMunicipio(id: number) {
  if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
  try {
    const res = await fetch(`${API_URL}/municipio/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Falha ao excluir município");
    return { success: true };
  } catch (e: any) {
    return { error: e?.message || "Erro ao excluir município" };
  }
}

