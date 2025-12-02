'use server';

import { actionClient } from '@/lib/safe-action';
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
