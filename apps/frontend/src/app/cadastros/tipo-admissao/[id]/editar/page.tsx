"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/page-container";
import { TipoAdmissaoForm } from "../../_components/TipoAdmissaoForm";
import { Button } from "@/components/ui/button";
import { getTipoAdmissaoById, updateTipoAdmissao } from "@/actions/cadastros/tipo-admissao-actions";
import { toast } from "sonner";

export default function TipoAdmissaoEditarPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const r = await getTipoAdmissaoById(Number(params.id));
      if ((r as any).error) {
        toast.error(String((r as any).error));
        return;
      }
      setForm((r as any).tipo);
    }
    load();
  }, [params.id]);

  async function save() {
    if (!form) return;
    const r = await updateTipoAdmissao(form);
    if ((r as any).error) {
      toast.error(String((r as any).error));
      return;
    }
    toast.success("Tipo de admissão atualizado");
    router.push("/tipo-admissao");
  }

  if (!form) {
    return (
      <PageContainer title="Editar Tipo de Admissão">
        <div className="p-6 text-sm text-muted-foreground">Carregando...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={`Editar Tipo de Admissão #${form.id}`}>
      <div className="space-y-4 pb-24">
        <TipoAdmissaoForm value={form} onChange={setForm} />
        <div className="sticky bottom-0 z-50 border-t bg-background/80 backdrop-blur px-6 py-3 flex items-center justify-end gap-2">
          <Button onClick={save}>Salvar</Button>
          <Button variant="outline" onClick={() => router.push("/tipo-admissao")}>Cancelar</Button>
        </div>
      </div>
    </PageContainer>
  );
}

