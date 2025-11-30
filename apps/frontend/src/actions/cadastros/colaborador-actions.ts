"use server";

import { apiFetch } from "@/lib/api";
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
        const endpoint = `/colaborador${queryString ? `?${queryString}` : ''}`;

        console.log('[getColaboradores] Endpoint:', endpoint);
        const data = await apiFetch<any[]>(endpoint);
        console.log('[getColaboradores] Dados recebidos:', data?.length, 'registros');
        return { colaboradores: data };
    } catch (error) {
        console.error('[getColaboradores] Erro:', error);
        return { error: "Falha ao buscar colaboradores" };
    }
}

export async function getColaborador(id: number) {
    return apiFetch<Colaborador>(`/colaborador/${id}`);
}

export async function getColaboradorById(id: number) {
    try {
        const data = await apiFetch<any>(`/colaborador/${id}`);
        return { colaborador: data };
    } catch (error) {
        return { error: "Falha ao buscar colaborador" };
    }
}

export async function createColaborador(data: any) {
    const res = await apiFetch<any>("/colaborador", {
        method: "POST",
        body: JSON.stringify(data),
    });
    revalidatePath("/cadastros/colaborador");
    return res;
}

export async function updateColaborador(data: any) {
    const res = await apiFetch<any>(`/colaborador/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    revalidatePath("/cadastros/colaborador");
    return res;
}

export async function deleteColaboradorAction(params: { id: number }) {
    await apiFetch(`/colaborador/${params.id}`, {
        method: "DELETE",
    });
    revalidatePath("/cadastros/colaborador");
}
