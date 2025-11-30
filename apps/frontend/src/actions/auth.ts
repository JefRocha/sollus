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
            const response = await apiFetch<{ token: string }>('/login', {
                method: 'POST',
                body: JSON.stringify({ login, senha }),
            });

            if (response.token) {
                // Armazenar o token em um cookie seguro
                const cookieStore = await cookies();
                cookieStore.set('sollus_token', response.token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7, // 7 dias
                });

                return { success: true };
            }

            return { success: false, error: 'Token não retornado pelo servidor' };
        } catch (error: any) {
            return { success: false, error: 'Usuário ou senha inválidos' };
        }
    });

export const logoutAction = actionClient
    .action(async () => {
        try {
            const cookieStore = await cookies();
            // Limpar o cookie do access token
            cookieStore.delete('sollus_token');
            // Limpar o cookie do refresh token
            cookieStore.delete('sollus_refresh');
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Erro ao fazer logout' };
        }
    });
