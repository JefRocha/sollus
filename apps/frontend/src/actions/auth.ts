'use server';

import { z } from 'zod';
import { actionClient } from '@/lib/safe-action';
import { apiFetch } from '@/lib/api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const loginSchema = z.object({
  login: z.string().min(1, 'Login é obrigatório'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export const loginAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput: { login, senha } }) => {
    try {
      const r = await apiFetch<any>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ login, senha }),
        suppressErrorLog: true,
      });
      const access = r?.token ?? r?.access_token ?? r?.accessToken ?? r?.jwt ?? r?.data?.token;
      const refresh = r?.refreshToken ?? r?.refresh_token ?? r?.refreshToken ?? r?.data?.refresh; // Changed to r?.refreshToken

      if (!access) {
        return { success: false, error: 'Token de acesso não retornado pelo servidor' };
      }

      const cookieStore = await cookies();
      // Define o access token como um cookie regular (não httpOnly) para ser lido por Server Components
      cookieStore.set('sollus_access_token', access, {
        httpOnly: false, // Não httpOnly para ser acessível por JS no cliente
        secure: false, // Temporariamente false para desenvolvimento local (HTTP)
        path: '/',
        maxAge: 60 * 15, // 15 minutos
      });
      // O refresh token será retornado e armazenado no localStorage pelo cliente

      return { success: true, token: access, refreshToken: refresh }; // Retorna ambos os tokens
    } catch (error: any) {
      return { success: false, error: 'Usuário ou senha inválidos' };
    }
  });

export const logoutAction = actionClient
  .action(async () => {
    try {
      const cookieStore = await cookies();
      // Limpar o cookie do access token
      cookieStore.delete('sollus_access_token'); // Changed from sollus_token
      // O refresh token está no localStorage, será limpo pelo cliente
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao fazer logout' };
    }
  });
