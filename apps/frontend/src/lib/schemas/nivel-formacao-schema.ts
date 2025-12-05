import { z } from "zod";

export const nivelFormacaoSchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(1, { message: "Nome é obrigatório" }),
    observacao: z.string().optional().nullable(),
});

export type NivelFormacao = z.infer<typeof nivelFormacaoSchema>;
