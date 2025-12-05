'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClientFetch } from "@/lib/api-client";
import { useRouter } from 'next/navigation';
// Removido uso de server action para garantir Set-Cookie no navegador
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';

const loginSchema = z.object({
    login: z.string().min(1, 'Login é obrigatório'),
    senha: z.string().min(1, 'Senha é obrigatória'),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();
    const [isExecuting, setExecuting] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            login: '',
            senha: '',
        },
    });

    async function onSubmit(values: LoginSchema) {
        setExecuting(true);
        setErrorMsg(null);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:4000';
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            if (!res.ok) throw new Error(`login_failed_${res.status}`);
            const r = await res.json();
            const access = r?.token ?? r?.access_token ?? r?.accessToken ?? r?.jwt ?? r?.data?.token;
            const refresh = r?.refreshToken ?? r?.refresh_token ?? r?.data?.refresh;
            const COOKIE_ONLY = process.env.NEXT_PUBLIC_AUTH_COOKIE_ONLY === '1';
            try {
                if (!COOKIE_ONLY) {
                    if (access) window.localStorage.setItem('sollus_access_token', access);
                    if (refresh) window.localStorage.setItem('sollus_refresh_token', refresh);
                }
            } catch {}
            try {
                window.location.href = '/dashboard';
            } catch {
                router.push('/dashboard');
            }
        } catch (e) {
            console.error('Login error:', e);
            setErrorMsg('Usuário ou senha inválidos');
        } finally {
            setExecuting(false);
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Sollus ERP</CardTitle>
                <CardDescription className="text-center">
                    Entre com suas credenciais para acessar o sistema
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="login"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Login</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Seu usuário" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="senha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Senha</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Sua senha" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {errorMsg && (
                            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isExecuting}>
                            {isExecuting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="justify-center text-sm text-muted-foreground">
                CS Solutions © 2025
            </CardFooter>
        </Card>
    );
}
