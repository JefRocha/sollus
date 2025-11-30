"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import { apiFetch } from "@/lib/api";
import { bancoSchema } from "@/lib/schemas/banco-schema";
import { z } from "zod";

export async function getBancos(searchParams: any) {
    try {
        const data = await apiFetch<any[]>("/banco");
        return { bancos: data };
    } catch (error) {
        return { error: "Falha ao buscar bancos" };
    }
}

export async function getBancoById(id: number) {
    try {
        const data = await apiFetch<any>(`/banco/${id}`);
        return { banco: data };
    } catch (error) {
        return { error: "Falha ao buscar banco" };
    }
}

export const createBanco = actionClient
    .schema(bancoSchema)
    .action(async ({ parsedInput }) => {
        try {
            await apiFetch("/banco", {
                method: "POST",
                body: JSON.stringify(parsedInput),
            });
            revalidatePath("/cadastros/bancos");
            return { success: "Banco criado com sucesso" };
        } catch (error) {
            return { error: "Falha ao criar banco" };
        }
    });

export const updateBanco = actionClient
    .schema(bancoSchema)
    .action(async ({ parsedInput }) => {
        try {
            const { id, ...data } = parsedInput;
            await apiFetch(`/banco/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            });
            revalidatePath("/cadastros/bancos");
            return { success: "Banco atualizado com sucesso" };
        } catch (error) {
            return { error: "Falha ao atualizar banco" };
        }
    });

export const deleteBanco = actionClient
    .schema(z.object({ id: z.number() }))
    .action(async ({ parsedInput: { id } }) => {
        try {
            await apiFetch(`/banco/${id}`, {
                method: "DELETE",
            });
            revalidatePath("/cadastros/bancos");
            return { success: "Banco excluído com sucesso" };
        } catch (error) {
            return { error: "Falha ao excluir banco" };
        }
    });
