"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageContainer } from "@/components/page-container";
import { EstadoCivilForm, estadoCivilSchema, EstadoCivilFormValues } from "../_components/EstadoCivilForm";
import { Button } from "@/components/ui/button";
import { createEstadoCivil } from "@/actions/cadastros/estado-civil-actions";
import { toast } from "sonner";

export default function EstadoCivilNovoPage() {
  const router = useRouter();
  const form = useForm<EstadoCivilFormValues>({
    resolver: zodResolver(estadoCivilSchema) as any,
    defaultValues: {},
  });

  async function onSubmit(data: EstadoCivilFormValues) {
    const res = await createEstadoCivil(data);
    if ((res as any).error) {
      toast.error(String((res as any).error));
      return;
    }
    toast.success("Estado civil criado");
    router.push("/cadastros/estado-civil");
  }

  return (
    <PageContainer title="Novo Estado Civil">
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
