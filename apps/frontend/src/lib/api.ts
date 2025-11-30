import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    // Obter o token do cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('sollus_token')?.value;

    const res = await fetch(url, {
        ...options,
        credentials: 'include', // IMPORTANTE: envia cookies httpOnly
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options?.headers,
        },
    });

    if (!res.ok) {
        if (res.status === 401) {
            // Tenta renovar o token
            try {
                const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include', // IMPORTANTE: envia cookie sollus_refresh
                    headers: { 'Content-Type': 'application/json' },
                });

                if (refreshRes.ok) {
                    const { token: newAccessToken } = await refreshRes.json();

                    if (newAccessToken) {
                        // Atualiza o cookie sollus_token
                        cookieStore.set('sollus_token', newAccessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            path: '/',
                            maxAge: 60 * 15, // 15 minutos
                        });

                        // Tenta novamente a requisição original com o novo token
                        const retryRes = await fetch(url, {
                            ...options,
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${newAccessToken}`,
                                ...options?.headers,
                            },
                        });

                        if (retryRes.ok) {
                            return retryRes.json();
                        }
                    }
                }
            } catch (e) {
                console.error('Refresh token failed:', e);
            }

            // Se chegou aqui, refresh falhou - lançar erro para redirecionar para login
            throw new Error('Unauthorized');
        }

        const errorBody = await res.text().catch(() => null);
        throw new Error(`API Error: ${res.status} ${res.statusText}${errorBody ? ` - ${errorBody}` : ''}`);
    }

    return res.json();
}
