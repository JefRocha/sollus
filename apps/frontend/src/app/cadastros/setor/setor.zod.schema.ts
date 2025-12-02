import { z } from "zod";

export const setorSchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(1, "Nome é obrigatório").max(100),
    descricao: z.string().max(255).optional(),
});

export type SetorSchema = z.infer<typeof setorSchema>;
