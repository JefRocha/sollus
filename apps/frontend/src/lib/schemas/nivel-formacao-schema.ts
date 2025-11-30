import { z } from "zod";

export const nivelFormacaoSchema = z.object({
    id: z.number().optional(),
    nome: z.string({ required_error: "Nome é obrigatório" }).min(1, "Nome é obrigatório"),
    observacao: z.string().optional().nullable(),
});

export type NivelFormacao = z.infer<typeof nivelFormacaoSchema>;
