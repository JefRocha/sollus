"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen } from "lucide-react";

interface PrivacyAcceptanceDialogProps {
    open: boolean;
    onAccept: () => void;
}

export function PrivacyAcceptanceDialog({ open, onAccept }: PrivacyAcceptanceDialogProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAccept = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent auto-close
        setLoading(true);
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("sollus_access_token") : null;

            // Function to get cookie by name
            const getCookie = (name: string) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop()?.split(';').shift();
            };

            const csrfToken = getCookie('XSRF-TOKEN');

            const res = await fetch("/api/auth/aceite-politica", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "x-csrf-token": csrfToken || ""
                }
            });

            if (res.ok) {
                onAccept();
            } else {
                console.error("Falha ao aceitar política");
                setLoading(false);
            }
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Atualização da Política de Privacidade</AlertDialogTitle>
                    <AlertDialogDescription>
                        Para continuar utilizando o Sollus ERP, é necessário que você leia e aceite nossa nova Política de Privacidade.
                        Nós atualizamos nossos termos para garantir maior segurança e transparência no tratamento dos seus dados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex justify-center py-4">
                    <Button variant="outline" className="w-full" onClick={() => router.push("/privacidade")}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Ler Política de Privacidade
                    </Button>
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={handleAccept} disabled={loading}>
                        {loading ? "Processando..." : "Li e Aceito a Política"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
