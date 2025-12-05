"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageContainer } from "@/components/page-container";
import { MunicipioForm } from "../_components/MunicipioForm";
import { municipioSchema, type MunicipioSchema as MunicipioFormValues } from "../municipio.zod.schema";
import { Button } from "@/components/ui/button";
import { municipioGetById } from "../municipio.service";
import { createMunicipio, updateMunicipio } from "@/actions/cadastros/municipio-actions";
import { toast } from "sonner";

export default function MunicipioIdPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const isNovo = params.id === "novo";
  const form = useForm<MunicipioFormValues>({ resolver: zodResolver(municipioSchema) as any, defaultValues: { id: isNovo ? undefined : Number(params.id), nome: "", codigoIbge: 0, uf: "" } });

  useEffect(() => {
    async function load() {
      if (isNovo) return;
      const m = await municipioGetById(Number(params.id));
      form.reset({ id: m.id, nome: m.nome ?? "", codigoIbge: Number(m.codigoIbge ?? 0), uf: m.uf ?? "" });
    }
    load();
  }, [params.id]);

  async function save() {
    const values = form.getValues();
    const action = isNovo ? createMunicipio : updateMunicipio;
    const r = await action(values);
    if ((r as any)?.serverError) { toast.error(String((r as any).serverError)); return; }
    toast.success(isNovo ? "Município criado" : "Município atualizado");
    router.push("/cadastros/municipio");
  }

  return (
    <PageContainer title={isNovo ? "Novo Município" : `Editar Município #${form.getValues().id}`}>
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
