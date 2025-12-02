'use server';

import { actionClient } from '@/lib/safe-action';
import { z } from 'zod';
import { createSetor, updateSetor } from '@/app/cadastros/setor/setor.service';
import { setorSchema } from '@/app/cadastros/setor/setor.zod.schema';
import { revalidatePath } from 'next/cache';

export const createSetorAction = actionClient
    .schema(setorSchema)
    .action(async ({ parsedInput }) => {
        try {
            const newSetor = await createSetor(parsedInput);
            revalidatePath('/cadastros/setor');
            return { success: true, data: newSetor };
        } catch (error: any) {
            console.error("[SERVER ACTION ERROR] createSetorAction failed:", error);
            return { success: false, error: error.message || 'Erro ao criar setor.' };
        }
    });

export const updateSetorAction = actionClient
    .schema(setorSchema.extend({ id: z.number() }))
    .action(async ({ parsedInput }) => {
        try {
            const { id, ...data } = parsedInput;
            const updatedSetor = await updateSetor(id, data);
            revalidatePath('/cadastros/setor');
            revalidatePath(`/cadastros/setor/${id}`);
            return { success: true, data: updatedSetor };
        } catch (error: any) {
            console.error("[SERVER ACTION ERROR] updateSetorAction failed:", error);
            return { success: false, error: error.message || 'Erro ao atualizar setor.' };
        }
    });
