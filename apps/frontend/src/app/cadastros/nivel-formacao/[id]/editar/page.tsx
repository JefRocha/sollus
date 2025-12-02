"use client";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { PageContainer } from "@/components/page-container";
import { NivelFormacaoForm, nivelFormacaoSchema, NivelFormacaoFormValues } from "../../_components/NivelFormacaoForm";
import { Button } from "@/components/ui/button";
import { getNivelFormacaoById, updateNivelFormacao } from "@/actions/cadastros/nivel-formacao-actions";
import { toast } from "sonner";

export default function NivelFormacaoEditarPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const form = useForm<NivelFormacaoFormValues>({
        resolver: zodResolver(nivelFormacaoSchema) as any,
        defaultValues: {},
    });

    useEffect(() => {
        console.log('[NivelFormacaoEditarPage] useEffect triggered, params.id:', params.id);
        async function load() {
            console.log('[NivelFormacaoEditarPage] Starting load...');
            const r = await getNivelFormacaoById(Number(params.id));
            console.log('[NivelFormacaoEditarPage] Result:', r);
            if ((r as any).error) {
                console.error('[NivelFormacaoEditarPage] Error:', (r as any).error);
                toast.error(String((r as any).error));
                return;
            }
            console.log('[NivelFormacaoEditarPage] Resetting form with:', (r as any).nivelFormacao);
            form.reset((r as any).nivelFormacao);
        }
        load();
    }, [params.id, form]);

    async function onSubmit(data: NivelFormacaoFormValues) {
        const res = await updateNivelFormacao(data);
        if ((res as any).error) {
            toast.error(String((res as any).error));
            return;
        }
        toast.success("Nível de formação atualizado");
        router.push("/cadastros/nivel-formacao");
    }

    return (
        <PageContainer title={`Editar Nível de Formação #${params.id}`}>
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
