import { z } from 'zod';

export const paisSchema = z.object({
  id: z.number().optional(),
  nomePtbr: z.string(),
  nomeEn: z.string(),
  sigla2: z.string(),
  sigla3: z.string(),
  codigo: z.any(),
  codigoBacen: z.any(),
});