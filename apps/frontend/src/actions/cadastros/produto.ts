"use server";
import { actionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { produtoSchema } from "@/app/cadastros/produto/produto.zod.schema";
import {
  produtoCreate,
  produtoUpdate,
} from "@/app/cadastros/produto/produto.service";
import { z } from "zod";

export const createProdutoAction = actionClient
  .schema(produtoSchema)
  .action(async ({ parsedInput }) => {
    try {
      const saved = await produtoCreate(parsedInput);
      revalidatePath("/cadastros/produto");
      return { success: true, data: saved };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Erro ao criar produto",
      };
    }
  });

const produtoUpdateSchema = produtoSchema.merge(z.object({ id: z.number() }));

export const updateProdutoAction = actionClient
  .schema(produtoUpdateSchema)
  .action(async ({ parsedInput }) => {
    try {
      const saved = await produtoUpdate(parsedInput);
      revalidatePath("/cadastros/produto");
      revalidatePath(`/cadastros/produto/${parsedInput.id}`);
      return { success: true, data: saved };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Erro ao atualizar produto",
      };
    }
  });
