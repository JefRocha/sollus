"use client";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { PageContainer } from "@/components/page-container";
import { TabelaPrecoForm, tabelaPrecoSchema, TabelaPrecoFormValues } from "../../_components/TabelaPrecoForm";
import { Button } from "@/components/ui/button";
import { getTabelaPrecoById, updateTabelaPreco } from "@/actions/cadastros/tabela-preco-actions";
import { toast } from "sonner";

export default function TabelaPrecoEditarPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const form = useForm<TabelaPrecoFormValues>({
    resolver: zodResolver(tabelaPrecoSchema) as any,
    defaultValues: { principal: "N", coeficiente: 0 },
  });

  useEffect(() => {
    async function load() {
      const r = await getTabelaPrecoById(Number(params.id));
      if ((r as any).error) {
        toast.error(String((r as any).error));
        return;
      }
      form.reset((r as any).tabela);
    }
    load();
  }, [params.id, form]);

  async function onSubmit(data: TabelaPrecoFormValues) {
    const res = await updateTabelaPreco(data);
    if ((res as any).error) {
      toast.error(String((res as any).error));
      return;
    }
    toast.success("Tabela de preço atualizada");
    router.push("/cadastros/tabela-preco");
  }

  return (
    <PageContainer title={`Editar Tabela de Preço #${params.id}`}>
      <div className="space-y-4 pb-24">
        <TabelaPrecoForm form={form} />
        <div className="sticky bottom-0 z-50 border-t bg-background/80 backdrop-blur px-6 py-3 flex items-center justify-end gap-2">
          <Button onClick={form.handleSubmit(onSubmit)}>Salvar</Button>
          <Button variant="outline" onClick={() => router.push("/cadastros/tabela-preco")}>Cancelar</Button>
        </div>
      </div>
    </PageContainer>
  );
}
