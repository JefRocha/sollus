"use client";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { PageContainer } from "@/components/page-container";
import { EstadoCivilForm, estadoCivilSchema, EstadoCivilFormValues } from "../../_components/EstadoCivilForm";
import { Button } from "@/components/ui/button";
import { getEstadoCivilById, updateEstadoCivil } from "@/actions/cadastros/estado-civil-actions";
import { toast } from "sonner";

export default function EstadoCivilEditarPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const form = useForm<EstadoCivilFormValues>({
    resolver: zodResolver(estadoCivilSchema) as any,
    defaultValues: {},
  });

  useEffect(() => {
    async function load() {
      const r = await getEstadoCivilById(Number(params.id));
      if ((r as any).error) {
        toast.error(String((r as any).error));
        return;
      }
      form.reset((r as any).estadoCivil);
    }
    load();
  }, [params.id, form]);

  async function onSubmit(data: EstadoCivilFormValues) {
    const res = await updateEstadoCivil(data);
    if ((res as any).error) {
      toast.error(String((res as any).error));
      return;
    }
    toast.success("Estado civil atualizado");
    router.push("/cadastros/estado-civil");
  }

  return (
    <PageContainer title={`Editar Estado Civil #${params.id}`}>
      <div className="space-y-4 pb-24">
        <EstadoCivilForm form={form} />
        <div className="sticky bottom-0 z-50 border-t bg-background/80 backdrop-blur px-6 py-3 flex items-center justify-end gap-2">
          <Button onClick={form.handleSubmit(onSubmit)}>Salvar</Button>
          <Button variant="outline" onClick={() => router.push("/cadastros/estado-civil")}>Cancelar</Button>
        </div>
      </div>
    </PageContainer>
  );
}
