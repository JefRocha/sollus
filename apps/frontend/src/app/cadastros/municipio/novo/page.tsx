"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageContainer } from "@/components/page-container";
import { MunicipioForm, municipioSchema, type MunicipioFormValues } from "../_components/MunicipioForm";
import { Button } from "@/components/ui/button";
import { createMunicipio } from "@/actions/cadastros/municipio-actions";
import { toast } from "sonner";

export default function MunicipioNovoPage() {
  const router = useRouter();
  const form = useForm<MunicipioFormValues>({ resolver: zodResolver(municipioSchema), defaultValues: { nome: "", codigoIbge: 0, uf: "" } });
  async function save() {
    const values = form.getValues();
    const res = await createMunicipio(values);
    if ((res as any).error) { toast.error(String((res as any).error)); return; }
    toast.success("Município criado");
    router.push("/cadastros/municipio");
  }
  return (
    <PageContainer title="Novo Município">
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

