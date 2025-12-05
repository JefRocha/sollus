'use server';

import { actionClient } from '@/lib/safe-action';
import { apiFetch, isErrorResult } from '@/lib/api';
import { z } from 'zod';
import { createNivelFormacao, updateNivelFormacao } from '@/app/cadastros/nivel-formacao/nivel-formacao.service';
import { nivelFormacaoSchema } from '@/app/cadastros/nivel-formacao/nivel-formacao.zod.schema';
import { revalidatePath } from 'next/cache';

export const createNivelFormacaoAction = actionClient
    .schema(nivelFormacaoSchema)
    .action(async ({ parsedInput }) => {
        try {
            const newNivelFormacao = await createNivelFormacao(parsedInput);
            revalidatePath('/cadastros/nivel-formacao');
            return { success: true, data: newNivelFormacao };
        } catch (error: any) {
            console.error("[SERVER ACTION ERROR] createNivelFormacaoAction failed:", error);
            return { success: false, error: error.message || 'Erro ao criar nível de formação.' };
        }
    });

export const updateNivelFormacaoAction = actionClient
    .schema(nivelFormacaoSchema.extend({ id: z.number() }))
    .action(async ({ parsedInput }) => {
        try {
            const { id, ...data } = parsedInput;
            const updatedNivelFormacao = await updateNivelFormacao(id, data);
            revalidatePath('/cadastros/nivel-formacao');
            revalidatePath(`/cadastros/nivel-formacao/${id}`);
            return { success: true, data: updatedNivelFormacao };
        } catch (error: any) {
            console.error("[SERVER ACTION ERROR] updateNivelFormacaoAction failed:", error);
            return { success: false, error: error.message || 'Erro ao atualizar nível de formação.' };
        }
    });

export async function getNiveisFormacao(searchParams: any): Promise<{ niveis?: any[]; error?: string }> {
    try {
        const params = new URLSearchParams();
        if (searchParams?.q) params.append('filter', searchParams.q);
        const base = `/nivel-formacao${params.toString() ? `?${params.toString()}` : ''}`;
        const data = await apiFetch<any[]>([base, base.replace('/nivel-formacao', '/niveis-formacao'), `/api${base}`, `/cadastros${base}`], { suppressErrorLog: true });
        if (isErrorResult(data)) return { error: 'Falha ao buscar níveis de formação' };
        return { niveis: data };
    } catch (error) {
        return { error: 'Falha ao buscar níveis de formação' };
    }
}

export async function getNivelFormacaoById(id: number): Promise<{ nivelFormacao?: any; error?: string }> {
    const data = await apiFetch<any>([`/nivel-formacao/${id}`, `/niveis-formacao/${id}`, `/api/nivel-formacao/${id}`, `/cadastros/nivel-formacao/${id}`], { suppressErrorLog: true });
    if (isErrorResult(data)) {
        return { error: 'Falha ao buscar nível de formação' };
    }
    return { nivelFormacao: data };
}
