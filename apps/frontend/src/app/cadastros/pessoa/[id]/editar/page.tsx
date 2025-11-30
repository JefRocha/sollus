"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getPessoa, updatePessoa, type Pessoa } from "@/actions/cadastros/pessoa-actions";
import { FormTabs } from "../../_components/FormTabs";
import { toast } from "sonner";
import { PageContainer } from "@/components/page-container";

export default function PessoaEditarPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [form, setForm] = useState<Pessoa | null>(null);

  useEffect(() => {
    async function load() {
      const id = Number(params.id);
      try {
        const remote = await getPessoa(id);
        const normalized = {
          ...remote,
          pessoaContatoModelList: remote.pessoaContatoModelList ?? [],
          pessoaTelefoneModelList: remote.pessoaTelefoneModelList ?? [],
          pessoaEnderecoModelList: remote.pessoaEnderecoModelList ?? [],
        } as Pessoa;
        setForm(normalized);
      } catch {
        toast.error("Erro ao carregar pessoa");
      }
    }
    if (params.id) {
      load();
    }
  }, [params.id]);

  async function save() {
    if (!form) return;
    try {
      await updatePessoa(form);
      toast.success("Pessoa atualizada com sucesso");
      router.push("/cadastros/pessoa");
    } catch {
      toast.error("Erro ao atualizar pessoa");
    }
  }

  if (!form) {
    return (
      <PageContainer title="Editar Pessoa" description="Carregando dados...">
        <div className="flex flex-col items-center gap-4 py-8">
          <p className="text-sm text-muted-foreground">Carregando...</p>
          <Button variant="outline" onClick={() => router.push("/cadastros/pessoa")}>Voltar</Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={`Editar Pessoa #${form.id}`} description="Atualize os dados da pessoa.">
      <div className="space-y-4">
        <FormTabs value={form} onChange={(v) => setForm({ ...(form as Pessoa), ...v })} />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.push("/cadastros/pessoa")}>Cancelar</Button>
          <Button onClick={save}>Salvar</Button>
        </div>
      </div>
    </PageContainer>
  );
}
