"use server";

import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { produtoGetById } from "@/app/cadastros/produto/produto.service";

export const getProdutoAction = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput;
    const data = await produtoGetById(id);
    return { produto: data };
  });
