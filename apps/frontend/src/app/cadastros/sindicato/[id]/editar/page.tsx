"use client";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { PageContainer } from "@/components/page-container";
import { SindicatoForm, sindicatoSchema, SindicatoFormValues } from "../../_components/SindicatoForm";
import { Button } from "@/components/ui/button";
import { getSindicatoById, updateSindicato } from "@/actions/cadastros/sindicato-actions";
import { toast } from "sonner";

export default function SindicatoEditarPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const form = useForm<SindicatoFormValues>({
    resolver: zodResolver(sindicatoSchema) as any,
    defaultValues: {},
  });

  useEffect(() => {
    async function load() {
      const r = await getSindicatoById(Number(params.id));
      if ((r as any).error) {
        toast.error(String((r as any).error));
        return;
      }
      form.reset((r as any).sindicato);
    }
    load();
  }, [params.id, form]);

  async function onSubmit(data: SindicatoFormValues) {
    const res = await updateSindicato(data);
    if ((res as any).error) {
      toast.error(String((res as any).error));
      return;
    }
    toast.success("Sindicato atualizado");
    router.push("/cadastros/sindicato");
  }

  return (
    <PageContainer title={`Editar Sindicato #${params.id}`}>
      <div className="space-y-4 pb-24">
        <SindicatoForm form={form} />
        <div className="sticky bottom-0 z-50 border-t bg-background/80 backdrop-blur px-6 py-3 flex items-center justify-end gap-2">
          <Button onClick={form.handleSubmit(onSubmit)}>Salvar</Button>
          <Button variant="outline" onClick={() => router.push("/cadastros/sindicato")}>Cancelar</Button>
        </div>
      </div>
    </PageContainer>
  );
}
