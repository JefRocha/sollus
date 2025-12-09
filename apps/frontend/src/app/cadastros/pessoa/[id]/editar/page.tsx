"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Pessoa } from "@/actions/cadastros/pessoa-actions";
import { updatePessoaClient } from "../../pessoa.service.client";

export default function PessoaEditarPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [form, setForm] = useState<Pessoa | null>(null);
  const [initial, setInitial] = useState<Pessoa | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    "Não foi possível salvar a pessoa. Tente novamente."
  );

  useEffect(() => {
    const id = Number(params.id);
    if (!id) return;
    executeGet({ id });
  }, [params.id]);

  const { execute: executeGet } = useAction(getPessoaAction, {
    onSuccess: ({ data }) => {
      const remote = (data as any)?.pessoa as Pessoa;
      const normalized = {
        ...remote,
        pessoaContatoModelList: remote.pessoaContatoModelList ?? [],
        pessoaTelefoneModelList: remote.pessoaTelefoneModelList ?? [],
        pessoaEnderecoModelList: remote.pessoaEnderecoModelList ?? [],
      } as Pessoa;
      setForm(normalized);
      setInitial(normalized);
    },
    onError: () => {
      setSuccessOpen(false);
    },
  });

  /*
  const { execute: executeUpdate, status: updateStatus } = useAction(
    updatePessoaAction,
    {
      onSuccess: () => {
        setSuccessOpen(true);
        setSaving(false);
      },
      onError: () => {
        setSaving(false);
        setErrorOpen(true);
      },
    }
  );
  */

  async function save() {
    if (!form) return;
    try {
      setSaving(true);

      if (initial?.eh_colaborador === "S" && form.eh_colaborador === "N") {
        form.eh_colaborador = "S" as any;
      }
      if (form.eh_colaborador === "S") {
        const existingId = (initial as any)?.colaboradorModel?.id;
        if (existingId && !(form as any)?.colaboradorModel?.id) {
          (form as any).colaboradorModel = { id: existingId, statusCrud: "U" };
        }
      }

      // PREPARAÇÃO DO PAYLOAD
      // Mapeia os Models para as propriedades esperadas pelo Backend
      // E remove o ID para forçar a criação de novos registros (já que o backend faz excluirFilhos)
      const payload: any = {
        ...form,
        pessoaFisica: (form as any).pessoaFisicaModel
          ? { ...(form as any).pessoaFisicaModel, id: undefined }
          : undefined,
        pessoaJuridica: (form as any).pessoaJuridicaModel
          ? { ...(form as any).pessoaJuridicaModel, id: undefined }
          : undefined,
        cliente: (form as any).clienteModel
          ? { ...(form as any).clienteModel, id: undefined }
          : undefined,
        fornecedor: (form as any).fornecedorModel
          ? { ...(form as any).fornecedorModel, id: undefined }
          : undefined,
        transportadora: (form as any).transportadoraModel
          ? { ...(form as any).transportadoraModel, id: undefined }
          : undefined,
        colaborador: (form as any).colaboradorModel
          ? { ...(form as any).colaboradorModel, id: undefined }
          : undefined,
        contador: (form as any).contadorModel
          ? { ...(form as any).contadorModel, id: undefined }
          : undefined,

        // Limpa as listas para recriação (assumindo que o backend também limpa listas)
        listaPessoaContato:
          (form as any).pessoaContatoModelList?.map((item: any) => ({
            ...item,
            id: undefined,
          })) ?? [],
        listaPessoaEndereco:
          (form as any).pessoaEnderecoModelList?.map((item: any) => ({
            ...item,
            id: undefined,
          })) ?? [],
        listaPessoaTelefone:
          (form as any).pessoaTelefoneModelList?.map((item: any) => ({
            ...item,
            id: undefined,
          })) ?? [],

        // Remove as propriedades Model para evitar envio de lixo e confusão no backend
        pessoaFisicaModel: undefined,
        pessoaJuridicaModel: undefined,
        clienteModel: undefined,
        fornecedorModel: undefined,
        transportadoraModel: undefined,
        colaboradorModel: undefined,
        contadorModel: undefined,
        pessoaContatoModelList: undefined,
        pessoaEnderecoModelList: undefined,
        pessoaTelefoneModelList: undefined,
      };

      // await executeUpdate({ pessoa: payload });
      await updatePessoaClient(payload);
      setSuccessOpen(true);
      setSaving(false);
    } catch {
      setSaving(false);
      setErrorOpen(true);
    }
  }

  if (!form) {
    return (
      <PageContainer title="Editar Pessoa" description="Carregando dados...">
        <div className="flex flex-col items-center gap-4 py-8">
          <p className="text-sm text-muted-foreground">Carregando...</p>
          <Button
            variant="outline"
            onClick={() => router.push("/cadastros/pessoa")}
          >
            Voltar
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`Editar Pessoa #${form.id}`}
      description="Atualize os dados da pessoa."
      wrapWithDashboardLayout={false}
    >
      <div className="space-y-4">
        <FormTabs
          value={form}
          onChange={(v) => setForm({ ...(form as Pessoa), ...v })}
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/cadastros/pessoa")}
          >
            Cancelar
          </Button>
          <Button
            onClick={save}
            disabled={saving || updateStatus === "executing"}
          >
            {saving || updateStatus === "executing" ? "Salvando..." : "Salvar"}
          </Button>
        </div>
        <AlertDialog open={successOpen} onOpenChange={setSuccessOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sucesso</AlertDialogTitle>
              <AlertDialogDescription>
                Pessoa atualizada com sucesso.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => {
                  setSuccessOpen(false);
                  router.push("/cadastros/pessoa");
                }}
              >
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog open={errorOpen} onOpenChange={setErrorOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Erro</AlertDialogTitle>
              <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setErrorOpen(false)}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageContainer>
  );
}
