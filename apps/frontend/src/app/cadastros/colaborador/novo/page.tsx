"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageContainer } from "@/components/page-container";
import { ColaboradorForm } from "../_components/ColaboradorForm";
import { Button } from "@/components/ui/button";
import { createColaborador } from "@/actions/cadastros/colaborador-actions";
import { toast } from "sonner";

export default function ColaboradorNovoPage() {
  const router = useRouter();
  const [form, setForm] = useState<any>({});
  async function save() {
    const payload = {
      idPessoa: form.pessoaModel?.id,
      idCargo: form.cargoModel?.id,
      idSetor: form.setorModel?.id,
      idColaboradorSituacao: form.colaboradorSituacaoModel?.id,
      idTipoAdmissao: form.tipoAdmissaoModel?.id,
      idColaboradorTipo: form.colaboradorTipoModel?.id,
      idSindicato: form.sindicatoModel?.id,
      matricula: form.matricula,
      dataCadastro: form.dataCadastro,
      dataAdmissao: form.dataAdmissao,
      dataDemissao: form.dataDemissao,
      ctpsNumero: form.ctpsNumero,
      ctpsSerie: form.ctpsSerie,
      ctpsDataExpedicao: form.ctpsDataExpedicao,
      ctpsUf: form.ctpsUf,
      observacao: form.observacao,
    };
    const res = await createColaborador(payload);
    if ((res as any).error) {
      toast.error(String((res as any).error));
      return;
    }
    toast.success("Colaborador criado");
    router.push("/cadastros/colaborador");
  }
  return (
    <PageContainer title="Novo Colaborador">
      <div className="space-y-4 pb-24">
        <ColaboradorForm value={form} onChange={setForm} />
        <div className="sticky bottom-0 z-50 border-t bg-background/80 backdrop-blur px-6 py-3 flex items-center justify-end gap-2">
          <Button onClick={save}>Salvar</Button>
          <Button variant="outline" onClick={() => router.push("/cadastros/colaborador")}>Cancelar</Button>
        </div>
      </div>
    </PageContainer>
  );
}

