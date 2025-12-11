"use server";

import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import {
  createCboServer,
  updateCboServer,
} from "@/actions/cadastros/cbo-fetch";
import { cboSchema } from "@/app/cadastros/cbo/cbo.zod.schema";
import { revalidatePath } from "next/cache";

export const createCboAction = actionClient
  .schema(cboSchema)
  .action(async ({ parsedInput }) => {
    try {
      const newCbo = await createCboServer(parsedInput);
      revalidatePath("/cadastros/cbo"); // Revalida a página de listagem
      return { success: true, data: newCbo };
    } catch (error: any) {
      console.error("[SERVER ACTION ERROR] createCboAction failed:", error); // Added log
      return { success: false, error: error.message || "Erro ao criar Cbo." };
    }
  });

export const updateCboAction = actionClient
  .schema(cboSchema.extend({ id: z.number() })) // Adiciona o ID para atualização
  .action(async ({ parsedInput }) => {
    try {
      const { id, ...data } = parsedInput;
      const updatedCbo = await updateCboServer(id, data);
      revalidatePath("/cadastros/cbo"); // Revalida a página de listagem
      revalidatePath(`/cadastros/cbo/${id}`); // Revalida a página de edição
      return { success: true, data: updatedCbo };
    } catch (error: any) {
      console.error("[SERVER ACTION ERROR] updateCboAction failed:", error); // Added log
      return {
        success: false,
        error: error.message || "Erro ao atualizar Cbo.",
      };
    }
  });
