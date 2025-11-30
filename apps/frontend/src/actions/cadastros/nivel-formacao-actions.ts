import { z } from "zod";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function normalizeList(json: any) {
    if (Array.isArray(json)) return json;
    if (Array.isArray(json?.data)) return json.data;
    if (Array.isArray(json?.content)) return json.content;
    return [];
}

export async function getNiveisFormacao(input: { q?: string; field?: string } = {}) {
    if (!API_URL) return { niveis: [], error: "NEXT_PUBLIC_API_URL não definido" };
    const q = input.q?.trim();
    const field = input.field || "nome";
    const base = `?page=1&limit=100`;
    const filter = q
        ? q.includes("$cont") || q.includes("$eq") || q.includes("$between")
            ? `${base}&filter=${encodeURIComponent(q)}`
            : `${base}&filter=${field}||$cont||${encodeURIComponent(q)}`
        : base;
    try {
        const res = await fetch(`${API_URL}/nivel-formacao${filter}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao carregar níveis de formação");
        const json = await res.json();
        return { niveis: normalizeList(json) };
    } catch (e: any) {
        return { niveis: [], error: e?.message || "Erro ao buscar níveis de formação" };
    }
}

export async function getNivelFormacaoById(id: number) {
    if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
    try {
        const res = await fetch(`${API_URL}/nivel-formacao/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao carregar nível de formação");
        const json = await res.json();
        const nivel = Array.isArray(json)
            ? json[0]
            : (typeof json?.data === "object" && json?.data !== null)
                ? json.data
                : json;
        return { nivel };
    } catch (e: any) {
        return { error: e?.message || "Erro ao carregar nível de formação" };
    }
}

export async function createNivelFormacao(payload: any) {
    if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
    const schema = z.object({ id: z.number().min(1, { message: "ID inválido" }), nome: z.string({ message: "Nome obrigatório" }).min(1, { message: "Nome obrigatório" }), descricao: z.string().optional() });
    const parsed = schema.safeParse(payload);
    if (!parsed.success) return { error: parsed.error.issues.map((e) => e.message).join(", ") };
    try {
        const res = await fetch(`${API_URL}/nivel-formacao`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
        if (!res.ok) throw new Error("Falha ao criar nível de formação");
        return { nivel: await res.json() };
    } catch (e: any) {
        return { error: e?.message || "Erro ao criar nível de formação" };
    }
}

export async function updateNivelFormacao(payload: any) {
    if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
    const schema = z.object({ id: z.number().min(1, { message: "ID inválido" }), nome: z.string({ message: "Nome obrigatório" }).min(1, { message: "Nome obrigatório" }), descricao: z.string().optional() });
    const parsed = schema.safeParse(payload);
    if (!parsed.success) return { error: parsed.error.issues.map((e) => e.message).join(", ") };
    try {
        const res = await fetch(`${API_URL}/nivel-formacao/${parsed.data.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
        if (!res.ok) throw new Error("Falha ao atualizar nível de formação");
        return { nivel: await res.json() };
    } catch (e: any) {
        return { error: e?.message || "Erro ao atualizar nível de formação" };
    }
}

export async function deleteNivelFormacao(id: number) {
    if (!API_URL) return { error: "NEXT_PUBLIC_API_URL não definido" };
    try {
        const res = await fetch(`${API_URL}/nivel-formacao/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Falha ao excluir nível de formação");
        return { success: true };
    } catch (e: any) {
        return { error: e?.message || "Erro ao excluir nível de formação" };
    }
}
