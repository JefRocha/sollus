"use server";

import { apiFetch, isErrorResult } from "@/lib/api";
import { revalidatePath } from "next/cache";

export type Colaborador = {
    id: number;
    nome: string;
    email?: string;
    cpf?: string;
    dataNascimento?: string;
    dataAdmissao?: string;
    dataDemissao?: string;
    situacao?: string;
    tipo?: string;
};

export async function getColaboradores(searchParams?: any) {
    try {
        const params = new URLSearchParams();
        if (searchParams?.q) {
            params.append('filter', searchParams.q);
        }

        const queryString = params.toString();
        const base = `/colaborador${queryString ? `?${queryString}` : ''}`;
        const data = await apiFetch<any[]>([base, base.replace('/colaborador', '/colaboradores'), `/api${base}`, `/cadastros${base}`], { suppressErrorLog: true });
        if (isErrorResult(data)) {
            return { error: "Falha ao buscar colaboradores" };
        }
        return { colaboradores: data };
    } catch (error) {
        console.error('[getColaboradores] Erro:', error);
        return { error: "Falha ao buscar colaboradores" };
    }
}

export async function getColaborador(id: number) {
    const data = await apiFetch<Colaborador>([`/colaborador/${id}`, `/colaboradores/${id}`, `/api/colaborador/${id}`, `/cadastros/colaborador/${id}`], { suppressErrorLog: true });
    if (isErrorResult(data)) {
        throw new Error("Falha ao buscar colaborador");
    }
    return data;
}

export async function getColaboradorById(id: number) {
    const data = await apiFetch<any>([`/colaborador/${id}`, `/colaboradores/${id}`, `/api/colaborador/${id}`, `/cadastros/colaborador/${id}`], { suppressErrorLog: true });
    if (isErrorResult(data)) {
        return { error: "Falha ao buscar colaborador" };
    }
    return { colaborador: data };
}

export async function createColaborador(data: any) {
    const res = await apiFetch<any>(["/colaborador", "/colaboradores", "/api/colaborador", "/cadastros/colaborador"], {
        method: "POST",
        body: JSON.stringify(data),
        suppressErrorLog: true,
    });
    if (isErrorResult(res)) {
        throw new Error("Falha ao criar colaborador");
    }
    revalidatePath("/cadastros/colaborador");
    return res;
}

export async function updateColaborador(data: any) {
    const res = await apiFetch<any>([`/colaborador/${data.id}`, `/colaboradores/${data.id}`, `/api/colaborador/${data.id}`, `/cadastros/colaborador/${data.id}`], {
        method: "PUT",
        body: JSON.stringify(data),
        suppressErrorLog: true,
    });
    if (isErrorResult(res)) {
        throw new Error("Falha ao atualizar colaborador");
    }
    revalidatePath("/cadastros/colaborador");
    return res;
}

export async function deleteColaboradorAction(params: { id: number }) {
    await apiFetch([`/colaborador/${params.id}`, `/colaboradores/${params.id}`, `/api/colaborador/${params.id}`, `/cadastros/colaborador/${params.id}`], {
        method: "DELETE",
        suppressErrorLog: true,
    });
    revalidatePath("/cadastros/colaborador");
}
