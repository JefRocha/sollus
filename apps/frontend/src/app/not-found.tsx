"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const goBack = () => {
    try {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push("/dashboard");
      }
    } catch {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex h-[80vh] items-center justify-center px-6">
      <div className="glass-card max-w-md w-full p-6 text-center">
        <div className="text-2xl font-semibold mb-2">404</div>
        <p className="text-muted-foreground mb-4">Página não encontrada.</p>
        <div className="flex items-center justify-center gap-2">
          <button className="btn btn-secondary px-3 py-1.5" onClick={goBack}>Voltar</button>
          <Link href="/dashboard" className="btn btn-primary px-3 py-1.5">Ir para Início</Link>
        </div>
      </div>
    </div>
  );
}

