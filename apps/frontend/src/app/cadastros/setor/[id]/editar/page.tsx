"use client";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { PageContainer } from "@/components/page-container";
import { SetorForm, setorSchema, SetorFormValues } from "../../_components/SetorForm";
import { Button } from "@/components/ui/button";
import { getSetorById, updateSetor } from "@/actions/cadastros/setor-actions";
import { toast } from "sonner";

export default function SetorEditarPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const form = useForm<SetorFormValues>({
    resolver: zodResolver(setorSchema) as any,
    defaultValues: {},
  });

  useEffect(() => {
    async function load() {
      const r = await getSetorById(Number(params.id));
      if ((r as any).error) {
        toast.error(String((r as any).error));
        return;
      }
      form.reset((r as any).setor);
    }
    load();
  }, [params.id, form]);

  async function onSubmit(data: SetorFormValues) {
    const res = await updateSetor(data);
    if ((res as any).error) {
      toast.error(String((res as any).error));
      return;
    }
    toast.success("Setor atualizado");
    router.push("/cadastros/setor");
  }

  return (
    <PageContainer title={`Editar Setor #${params.id}`}>
      <div className="space-y-4 pb-24">
        <SetorForm form={form} />
        <div className="sticky bottom-0 z-50 border-t bg-background/80 backdrop-blur px-6 py-3 flex items-center justify-end gap-2">
          <Button onClick={form.handleSubmit(onSubmit)}>Salvar</Button>
          <Button variant="outline" onClick={() => router.push("/cadastros/setor")}>Cancelar</Button>
        </div>
      </div>
    </PageContainer>
  );
}
