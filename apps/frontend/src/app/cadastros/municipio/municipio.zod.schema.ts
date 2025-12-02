import { z } from "zod";

export const municipioSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(1, "Obrigatório"),
  codigoIbge: z.union([z.number(), z.string()]).transform((v) => Number(v)),
  uf: z.string().min(2).max(2),
});

export type MunicipioSchema = z.infer<typeof municipioSchema>;

