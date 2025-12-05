"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageContainer } from "@/components/page-container";
import { MunicipioForm, municipioSchema, type MunicipioFormValues } from "../../_components/MunicipioForm";
import { Button } from "@/components/ui/button";
import { getMunicipioById, updateMunicipio } from "@/actions/cadastros/municipio-actions";
import { toast } from "sonner";

export default function MunicipioEditarPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const form = useForm<MunicipioFormValues>({ resolver: zodResolver(municipioSchema) as any, defaultValues: { id: Number(params.id), nome: "", codigoIbge: 0, uf: "" } });

  useEffect(() => {
    async function load() {
      const r = await getMunicipioById(Number(params.id));
      if ((r as any).error) { toast.error(String((r as any).error)); return; }
      const m = (r as any).municipio;
      form.reset({ id: m.id, nome: m.nome ?? "", codigoIbge: Number(m.codigoIbge ?? 0), uf: m.uf ?? "" });
    }
    load();
  }, [params.id]);

  async function save() {
    const values = form.getValues();
    const r = await updateMunicipio(values);
    if ((r as any).error) { toast.error(String((r as any).error)); return; }
    toast.success("Município atualizado");
    router.push("/cadastros/municipio");
  }

  if (!form.getValues().id) {
    return (
      <PageContainer title="Editar Município">
        <div className="p-6 text-sm text-muted-foreground">Carregando...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={`Editar Município #${form.getValues().id}`}>
      <div className="space-y-4 pb-24">
        <MunicipioForm form={form} />
        <div className="sticky bottom-0 z-50 border-t bg-background/80 backdrop-blur px-6 py-3 flex items-center justify-end gap-2">
          <Button onClick={save}>Salvar</Button>
          <Button variant="outline" onClick={() => router.push("/cadastros/municipio")}>Cancelar</Button>
        </div>
      </div>
    </PageContainer>
  );
}
