import { z } from 'zod';

export const cboSchema = z.object({
  
  codigo: z.string().optional(),
  codigo1994: z.string().optional(),
  nome: z.string().optional(),
  observacao: z.string().optional(),
});

export type CboSchema = z.infer<typeof cboSchema>;
