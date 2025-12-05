"use server";

import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import {
  getPessoa,
  updatePessoa,
  type Pessoa,
} from "@/actions/cadastros/pessoa-actions";
import { revalidatePath } from "next/cache";

export const getPessoaAction = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput;
    const data = await getPessoa(id);
    return { pessoa: data } as { pessoa: Pessoa };
  });

export const updatePessoaAction = actionClient
  .schema(z.object({ pessoa: z.any() }))
  .action(async ({ parsedInput }) => {
    const { pessoa } = parsedInput as { pessoa: Pessoa };
    const updated = await updatePessoa(pessoa);
    revalidatePath("/cadastros/pessoa");
    revalidatePath(`/cadastros/pessoa/${pessoa.id}/editar`);
    return { success: true, pessoa: updated };
  });
