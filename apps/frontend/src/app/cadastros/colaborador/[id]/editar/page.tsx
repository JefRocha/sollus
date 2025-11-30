"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/page-container";
import { ColaboradorForm } from "../../_components/ColaboradorForm";
import { Button } from "@/components/ui/button";
import { getColaboradorById, updateColaborador } from "@/actions/cadastros/colaborador-actions";
import { toast } from "sonner";

export default function ColaboradorEditarPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const r = await getColaboradorById(Number(params.id));
      if ((r as any).error) {
        toast.error(String((r as any).error));
        return;
      }
      const c = (r as any).colaborador;
      const mapped = {
        id: c.id,
        pessoaModel: { id: c.idPessoa },
        cargoModel: { id: c.idCargo },
        setorModel: { id: c.idSetor },
        colaboradorSituacaoModel: { id: c.idColaboradorSituacao },
        tipoAdmissaoModel: { id: c.idTipoAdmissao },
        colaboradorTipoModel: { id: c.idColaboradorTipo },
        sindicatoModel: { id: c.idSindicato },
        matricula: c.matricula,
        dataCadastro: c.dataCadastro,
        dataAdmissao: c.dataAdmissao,
        dataDemissao: c.dataDemissao,
        ctpsNumero: c.ctpsNumero,
        ctpsSerie: c.ctpsSerie,
        ctpsDataExpedicao: c.ctpsDataExpedicao,
        ctpsUf: c.ctpsUf,
        observacao: c.observacao,
      };
      setForm(mapped);
    }
    load();
  }, [params.id]);

  async function save() {
    if (!form) return;
    const payload = {
      id: form.id,
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
    const r = await updateColaborador(payload);
    if ((r as any).error) {
      toast.error(String((r as any).error));
      return;
    }
    toast.success("Colaborador atualizado");
    router.push("/cadastros/colaborador");
  }

  if (!form) {
    return (
      <PageContainer title="Editar Colaborador">
        <div className="p-6 text-sm text-muted-foreground">Carregando...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={`Editar Colaborador #${form.id}`}>
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
