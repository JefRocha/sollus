"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageContainer } from "@/components/page-container";
import { TipoAdmissaoForm } from "../_components/TipoAdmissaoForm";
import { Button } from "@/components/ui/button";
import { createTipoAdmissao } from "@/actions/cadastros/tipo-admissao-actions";
import { toast } from "sonner";

export default function TipoAdmissaoNovoPage() {
  const router = useRouter();
  const [form, setForm] = useState<any>({});
  async function save() {
    const res = await createTipoAdmissao(form);
    if ((res as any).error) {
      toast.error(String((res as any).error));
      return;
    }
    toast.success("Tipo de admissão criado");
    router.push("/tipo-admissao");
  }
  return (
    <PageContainer title="Novo Tipo de Admissão">
      <div className="space-y-4 pb-24">
        <TipoAdmissaoForm value={form} onChange={setForm} />
        <div className="sticky bottom-0 z-50 border-t bg-background/80 backdrop-blur px-6 py-3 flex items-center justify-end gap-2">
          <Button onClick={save}>Salvar</Button>
          <Button variant="outline" onClick={() => router.push("/cadastros/tipo-admissao")}>Cancelar</Button>
        </div>
      </div>
    </PageContainer>
  );
}

