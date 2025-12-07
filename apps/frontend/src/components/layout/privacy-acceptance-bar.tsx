"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface PrivacyAcceptanceBarProps {
    onAccept: () => void;
}

export function PrivacyAcceptanceBar({ onAccept }: PrivacyAcceptanceBarProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAccept = async () => {
        setLoading(true);
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("sollus_access_token") : null;
            const res = await fetch("/api/auth/aceite-politica", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                onAccept();
                // Retorna para a página anterior após aceitar, ou para home se não houver histórico seguro
                router.back();
            } else {
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom print:hidden">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 shrink-0" />
                    <p className="font-medium text-center md:text-left text-sm md:text-base">
                        Para continuar utilizando o sistema, confirme que leu e está de acordo com nossa Política de Privacidade.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="secondary" onClick={handleAccept} disabled={loading} className="whitespace-nowrap font-bold">
                        {loading ? "Processando..." : "Li e Aceito"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
