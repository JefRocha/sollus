import { z } from 'zod';

export const usuarioSchema = z.object({
  
  idColaborador: z.number(),
  idPapel: z.number(),
  login: z.string().min(1, 'Login é obrigatório.'),
  senha: z.string().min(1, 'Senha é obrigatório.'),
  administrador: z.string().optional(),
  dataCadastro: z.string().optional(),
});

export type UsuarioSchema = z.infer<typeof usuarioSchema>;
