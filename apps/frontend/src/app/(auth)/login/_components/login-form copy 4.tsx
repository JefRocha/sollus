"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClientFetch } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Loader2, Lock, User, Sparkles } from "lucide-react";

const loginSchema = z.object({
  login: z.string().min(1, "Login é obrigatório"),
  senha: z.string().min(1, "Senha é obrigatória"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isExecuting, setExecuting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      senha: "",
    },
  });

  async function onSubmit(values: LoginSchema) {
    setExecuting(true);
    setErrorMsg(null);
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://localhost:4000";
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`login_failed_${res.status}`);
      const r = await res.json();
      const access =
        r?.token ??
        r?.access_token ??
        r?.accessToken ??
        r?.jwt ??
        r?.data?.token;
      const refresh = r?.refreshToken ?? r?.refresh_token ?? r?.data?.refresh;
      const COOKIE_ONLY = process.env.NEXT_PUBLIC_AUTH_COOKIE_ONLY === "1";
      try {
        if (!COOKIE_ONLY) {
          if (access)
            window.localStorage.setItem("sollus_access_token", access);
          if (refresh)
            window.localStorage.setItem("sollus_refresh_token", refresh);
        }
      } catch {}
      try {
        window.location.href = "/dashboard";
      } catch {
        router.push("/dashboard");
      }
    } catch (e) {
      console.error("Login error:", e);
      setErrorMsg("Usuário ou senha inválidos");
    } finally {
      setExecuting(false);
    }
  }

  return (
    <>
      {/* Fundo com gradiente moderno ocupando toda a tela */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950" />

      {/* Padrão de grade animado */}
      <div
        className="fixed inset-0 w-full h-full opacity-20"
        style={{
          backgroundImage: `
               linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
             `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Overlay com vignette */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-slate-950/50" />

      {/* Efeitos de luz animados */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="min-h-screen w-full flex items-center justify-center relative p-4">
        {/* Card principal */}
        <Card className="w-full max-w-md relative z-10 border-slate-800 bg-slate-900/80 backdrop-blur-2xl shadow-2xl shadow-black/50">
          {/* Header com design moderno */}
          <CardHeader className="space-y-6 pb-8 pt-10 px-8 border-b border-slate-800/50 bg-gradient-to-b from-slate-800/50 to-transparent">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Lock className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="text-center space-y-2">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Sollus ERP
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm">
                  Entre com suas credenciais para acessar o sistema
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <Form {...form}>
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="login"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-slate-200 text-sm font-medium">
                        Login
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-10 blur transition-opacity" />
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors z-10" />
                          <Input
                            placeholder="Seu usuário"
                            {...field}
                            className="relative pl-11 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-slate-200 text-sm font-medium">
                        Senha
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-10 blur transition-opacity" />
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors z-10" />
                          <Input
                            type="password"
                            placeholder="Sua senha"
                            {...field}
                            className="relative pl-11 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                {errorMsg && (
                  <div className="flex items-center gap-3 p-4 text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="pt-2 space-y-4">
                  <Button
                    type="submit"
                    onClick={form.handleSubmit(onSubmit)}
                    className="relative w-full h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 overflow-hidden group"
                    disabled={isExecuting}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                    {isExecuting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Entrando...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Entrar
                      </span>
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1 group"
                    >
                      <span>Esqueceu sua senha?</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </CardContent>

          <CardFooter className="justify-center text-xs text-slate-500 border-t border-slate-800/50 py-6 bg-slate-900/50">
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              CS Solutions © 2025
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
