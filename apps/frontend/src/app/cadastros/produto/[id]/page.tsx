"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageContainer } from "@/components/page-container";
import { ProdutoForm } from "../_components/produto-form";
import { produtoSchema, type ProdutoSchema } from "../produto.zod.schema";
import { Button } from "@/components/ui/button";
import { produtoGetById } from "../produto.service";
import { createProdutoAction, updateProdutoAction } from "@/actions/cadastros/produto";
import { toast } from "sonner";

export default function ProdutoIdPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const isNovo = params.id === "novo";
  const form = useForm<ProdutoSchema>({ resolver: zodResolver(produtoSchema), defaultValues: { id: isNovo ? undefined : Number(params.id), nome: "", valorCompra: 0, valorVenda: 0 } as any });

  useEffect(() => {
    async function load() {
      if (isNovo) return;
      const p = await produtoGetById(Number(params.id));
      form.reset({ ...p, valorCompra: Number(p.valorCompra ?? 0), valorVenda: Number(p.valorVenda ?? 0) });
    }
    load();
  }, [params.id]);

  async function save() {
    const values = form.getValues();
    const action = isNovo ? createProdutoAction : updateProdutoAction;
    const r = await action(values);
    if ((r as any)?.serverError) { toast.error(String((r as any).serverError)); return; }
    toast.success(isNovo ? "Produto criado" : "Produto atualizado");
    router.push("/cadastros/produto");
  }

  return (
    <PageContainer title={isNovo ? "Novo Produto" : `Editar Produto #${form.getValues().id}`}>
      <div className="space-y-4 pb-24">
        <ProdutoForm form={form} />
        <div className="sticky bottom-0 z-50 border-t bg-background/80 backdrop-blur px-6 py-3 flex items-center justify-end gap-2">
          <Button onClick={save}>Salvar</Button>
          <Button variant="outline" onClick={() => router.push("/cadastros/produto")}>Cancelar</Button>
        </div>
      </div>
    </PageContainer>
  );
}

