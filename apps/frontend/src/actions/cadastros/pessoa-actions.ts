"use server";

import { apiFetchServer } from "@/lib/api-server";
import { isErrorResult } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export type OptionItem = {
    id: number;
    nome: string;
};

export type Pessoa = {
    id: number;
    nome: string;
    tipo: "F" | "J";
    site?: string;
    email?: string;
    eh_cliente: "S" | "N";
    eh_fornecedor?: "S" | "N";
    eh_transportadora?: "S" | "N";
    eh_colaborador?: "S" | "N";
    eh_contador?: "S" | "N";
    clienteModel?: any;
    fornecedorModel?: any;
    transportadoraModel?: any;
    colaboradorModel?: any;
    contadorModel?: any;
    pessoaFisicaModel?: any;
    pessoaJuridicaModel?: any;
    pessoaContatoModelList?: any[];
    pessoaTelefoneModelList?: any[];
    pessoaEnderecoModelList?: any[];
};

async function getApiCtx() {
    const cookieStore = await cookies();
    const token = cookieStore.get("sollus_access_token")?.value;
    // Backend expects 'XSRF-TOKEN' cookie and 'x-csrf-token' header to match.
    // The browser sends the cookie to Next.js. We extract it here.
    const xsrfToken = cookieStore.get("XSRF-TOKEN")?.value || cookieStore.get("sollus_csrf_token")?.value;

    // We also validly construct the cookie header to pass along
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    return {
        accessToken: token,
        xsrfToken,
        cookieHeader
    };
}

export async function getPessoas(searchParams: any) {
    try {
        const params = new URLSearchParams();
        if (searchParams?.q) {
            params.append('filter', searchParams.q);
        }

        const queryString = params.toString();
        const base = `/api/pessoa${queryString ? `?${queryString}` : ''}`;
        const ctx = await getApiCtx();
        const data = await apiFetchServer<any[]>(base, { suppressErrorLog: true }, ctx);
        if (isErrorResult(data)) {
            return { error: "Falha ao buscar pessoas" };
        }
        return { pessoas: data };
    } catch (error) {
        return { error: "Falha ao buscar pessoas" };
    }
}

export async function getPessoa(id: number) {
    const ctx = await getApiCtx();
    const data = await apiFetchServer<Pessoa>(`/api/pessoa/${id}`, { suppressErrorLog: true }, ctx);
    if (isErrorResult(data)) {
        throw new Error("Falha ao buscar pessoa");
    }
    return data;
}

export async function createPessoa(data: Pessoa) {
    const ctx = await getApiCtx();
    const res = await apiFetchServer<Pessoa>("/api/pessoa", {
        method: "POST",
        body: JSON.stringify(data),
    }, ctx);
    if (isErrorResult(res)) {
        throw new Error("Falha ao criar pessoa");
    }
    revalidatePath("/cadastros/pessoa");
    return res;
}

export async function updatePessoa(data: Pessoa) {
    const ctx = await getApiCtx();
    const res = await apiFetchServer<Pessoa>(`/api/pessoa/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }, ctx);
    if (isErrorResult(res)) {
        throw new Error("Falha ao atualizar pessoa");
    }
    revalidatePath("/cadastros/pessoa");
    return res;
}

export async function getNivelFormacao(q: string = ""): Promise<OptionItem[]> {
    const params = new URLSearchParams();
    params.append('filter', q);
    const ctx = await getApiCtx();
    return apiFetchServer<OptionItem[]>(`/api/nivel-formacao?${params.toString()}`, {}, ctx);
}

export async function getEstadoCivil(q: string = ""): Promise<OptionItem[]> {
    const params = new URLSearchParams();
    params.append('filter', q);
    const ctx = await getApiCtx();
    return apiFetchServer<OptionItem[]>(`/api/estado-civil?${params.toString()}`, {}, ctx);
}
