'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/actions/auth';
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
    const { execute, isExecuting, result } = useAction(loginAction, {
        onSuccess: (data) => {
            if (data.data?.success) {
                router.push('/dashboard');
            }
        },
    });

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            login: '',
            senha: '',
        },
    });

    function onSubmit(values: LoginSchema) {
        execute(values);
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

                        {result.data?.error && (
                            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md">
                                <AlertCircle className="w-4 h-4" />
                                <span>{result.data.error}</span>
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
