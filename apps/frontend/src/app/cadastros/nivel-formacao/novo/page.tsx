"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageContainer } from "@/components/page-container";
import { NivelFormacaoForm, nivelFormacaoSchema, NivelFormacaoFormValues } from "../_components/NivelFormacaoForm";
import { Button } from "@/components/ui/button";
import { createNivelFormacao } from "@/actions/cadastros/nivel-formacao-actions";
import { toast } from "sonner";

export default function NivelFormacaoNovoPage() {
    const router = useRouter();
    const form = useForm<NivelFormacaoFormValues>({
        resolver: zodResolver(nivelFormacaoSchema) as any,
        defaultValues: {},
    });

    async function onSubmit(data: NivelFormacaoFormValues) {
        const res = await createNivelFormacao(data);
        if ((res as any).error) {
            toast.error(String((res as any).error));
            return;
        }
        toast.success("Nível de formação criado");
        router.push("/cadastros/nivel-formacao");
    }

    return (
        <PageContainer title="Novo Nível de Formação">
            <div className="space-y-4 pb-24">
                <NivelFormacaoForm form={form} />
                <div className="sticky bottom-0 z-50 border-t bg-background/80 backdrop-blur px-6 py-3 flex items-center justify-end gap-2">
                    <Button onClick={form.handleSubmit(onSubmit)}>Salvar</Button>
                    <Button variant="outline" onClick={() => router.push("/cadastros/nivel-formacao")}>Cancelar</Button>
                </div>
            </div>
        </PageContainer>
    );
}
