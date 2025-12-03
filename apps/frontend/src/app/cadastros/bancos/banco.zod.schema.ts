import { z } from "zod";

export const bancoSchema = z.object({
    id: z.number().optional(),
    codigo: z.string().min(1, "Código é obrigatório"),
    nome: z.string().min(1, "Nome é obrigatório"),
    url: z.string().nullable().optional(),
});

export type BancoSchema = z.infer<typeof bancoSchema>;
