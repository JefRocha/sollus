"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageContainer } from "@/components/page-container";
import { SindicatoForm, sindicatoSchema, SindicatoFormValues } from "../_components/SindicatoForm";
import { Button } from "@/components/ui/button";
import { createSindicato } from "@/actions/cadastros/sindicato-actions";
import { toast } from "sonner";

export default function SindicatoNovoPage() {
  const router = useRouter();
  const form = useForm<SindicatoFormValues>({
    resolver: zodResolver(sindicatoSchema) as any,
    defaultValues: {},
  });

  async function onSubmit(data: SindicatoFormValues) {
    const res = await createSindicato(data);
    if ((res as any).error) {
      toast.error(String((res as any).error));
      return;
    }
    toast.success("Sindicato criado");
    router.push("/cadastros/sindicato");
  }

  return (
    <PageContainer title="Novo Sindicato">
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
