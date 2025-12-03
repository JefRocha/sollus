"use server";

import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { createBanco, updateBanco, deleteBanco } from "@/app/cadastros/bancos/banco.service";
import { bancoSchema } from "@/app/cadastros/bancos/banco.zod.schema";
import { revalidatePath } from "next/cache";

export const createBancoAction = actionClient
    .schema(bancoSchema)
    .action(async ({ parsedInput }) => {
        try {
            const newBanco = await createBanco(parsedInput);
            revalidatePath("/cadastros/bancos");
            return { success: true, data: newBanco };
        } catch (error: any) {
            console.error("[SERVER ACTION ERROR] createBancoAction failed:", error);
            return { success: false, error: error.message || "Erro ao criar banco" };
        }
    });

export const updateBancoAction = actionClient
    .schema(bancoSchema.extend({ id: z.number() }))
    .action(async ({ parsedInput }) => {
        try {
            const { id, ...data } = parsedInput;
            const updatedBanco = await updateBanco(id, data);
            revalidatePath("/cadastros/bancos");
            revalidatePath(`/cadastros/bancos/${id}`);
            return { success: true, data: updatedBanco };
        } catch (error: any) {
            console.error("[SERVER ACTION ERROR] updateBancoAction failed:", error);
            return { success: false, error: error.message || "Erro ao atualizar banco" };
        }
    });

export const deleteBancoAction = actionClient
    .schema(z.object({ id: z.number() }))
    .action(async ({ parsedInput: { id } }) => {
        try {
            await deleteBanco(id);
            revalidatePath("/cadastros/bancos");
            return { success: true };
        } catch (error: any) {
            console.error("[SERVER ACTION ERROR] deleteBancoAction failed:", error);
            return { success: false, error: error.message || "Erro ao excluir banco" };
        }
    });
