"use client";
import { createPessoa, type Pessoa } from "@/actions/cadastros/pessoa-actions";
import { FormTabs } from "../_components/FormTabs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PageContainer } from "@/components/page-container";

export default function PessoaNovoPage() {
  const router = useRouter();
  const [form, setForm] = useState<Pessoa>({
    id: 0,
    nome: "",
    tipo: "F",
    eh_cliente: "N",
    eh_fornecedor: "N",
    eh_transportadora: "N",
    eh_colaborador: "N",
    eh_contador: "N",
  });

  async function save() {
    try {
      await createPessoa({ ...form, id: undefined as unknown as number });
      toast.success("Pessoa criada com sucesso");
      router.push("/cadastros/pessoa");
    } catch {
      toast.error("Erro ao criar pessoa");
    }
  }

  return (
    <PageContainer
      title="Nova Pessoa"
      description="Cadastre uma nova pessoa no sistema."
      wrapWithDashboardLayout={false}
    >
      <div className="space-y-4">
        <FormTabs value={form} onChange={setForm} />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.push("/cadastros/pessoa")}>Cancelar</Button>
          <Button onClick={save}>Salvar</Button>
        </div>
      </div>
    </PageContainer>
  );
}
