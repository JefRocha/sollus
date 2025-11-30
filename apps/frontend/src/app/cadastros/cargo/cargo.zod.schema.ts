import { z } from 'zod';

export const cargoSchema = z.object({
  
  nome: z.string().min(1, 'Nome é obrigatório.'),
  descricao: z.string().optional(),
  salario: z.number(),
  cbo1994: z.string().optional(),
  cbo2002: z.string().optional(),
});

export type CargoSchema = z.infer<typeof cargoSchema>;
