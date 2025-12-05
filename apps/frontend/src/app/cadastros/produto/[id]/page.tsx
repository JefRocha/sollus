"use client";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageContainer } from "@/components/page-container";
import { ProdutoForm } from "../_components/produto-form";
import { produtoSchema, type ProdutoSchema } from "../produto.zod.schema";
import { Button } from "@/components/ui/button";
import {
  createProdutoAction,
  updateProdutoAction,
} from "@/actions/cadastros/produto";
import { useAction } from "next-safe-action/hooks";
import { getProdutoAction } from "@/actions/cadastros/produto-safe-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function ProdutoIdPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const isNovo = params.id === "novo";
  const form = useForm<ProdutoSchema>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      id: isNovo ? undefined : Number(params.id),
      nome: "",
      valorCompra: 0,
      valorVenda: 0,
    } as any,
  });

  const [saving, setSaving] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    "Não foi possível salvar o produto. Tente novamente."
  );

  const { execute: execGet } = useAction(getProdutoAction, {
    onSuccess: ({ data }) => {
      const p = (data as any)?.produto;
      if (!p) return;
      form.reset({
        ...p,
        valorCompra: Number(p.valorCompra ?? 0),
        valorVenda: Number(p.valorVenda ?? 0),
      });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  useEffect(() => {
    if (isNovo) return;
    execGet({ id: Number(params.id) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function save() {
    const values = form.getValues();
    const action = isNovo ? createProdutoAction : updateProdutoAction;
    setSaving(true);
    try {
      const r = await action(values as any);
      setSaving(false);
      if ((r as any)?.serverError || (r as any)?.error) {
        setErrorMessage(
          String(
            (r as any)?.serverError ||
              (r as any)?.error ||
              "Erro ao salvar produto"
          )
        );
        setErrorOpen(true);
        return;
      }
      setSuccessOpen(true);
    } catch (e: any) {
      setSaving(false);
      setErrorMessage(String(e?.message || "Erro ao salvar produto"));
      setErrorOpen(true);
    }
  }

  return (
    <PageContainer
      title={isNovo ? "Novo Produto" : `Editar Produto #${form.getValues().id}`}
    >
      <div className="space-y-4 pb-24">
        <ProdutoForm form={form} />
        <div className="sticky bottom-0 z-50 border-t bg-background/80 backdrop-blur px-6 py-3 flex items-center justify-end gap-2">
          <Button onClick={save} disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/cadastros/produto")}
          >
            Cancelar
          </Button>
        </div>
        <FeedbackDialog
          open={successOpen}
          onOpenChange={setSuccessOpen}
          variant="success"
          title="Sucesso"
          description={
            isNovo
              ? "Produto criado com sucesso."
              : "Produto atualizado com sucesso."
          }
          secondaryLabel="Continuar editando"
          onSecondary={() => setSuccessOpen(false)}
          primaryLabel="Voltar à lista"
          onPrimary={() => {
            setSuccessOpen(false);
            const v = searchParams?.get("view");
            const suffix = v === "cards" || v === "table" ? `?view=${v}` : "";
            router.push(`/cadastros/produto${suffix}`);
          }}
        />
        <FeedbackDialog
          open={errorOpen}
          onOpenChange={setErrorOpen}
          variant="error"
          title="Erro"
          description={errorMessage}
          primaryLabel="OK"
          onPrimary={() => setErrorOpen(false)}
        />
      </div>
    </PageContainer>
  );
}
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
