"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageContainer } from "@/components/page-container";
import { TabelaPrecoForm, tabelaPrecoSchema, TabelaPrecoFormValues } from "../_components/TabelaPrecoForm";
import { Button } from "@/components/ui/button";
import { createTabelaPreco } from "@/actions/cadastros/tabela-preco-actions";
import { toast } from "sonner";

export default function TabelaPrecoNovoPage() {
  const router = useRouter();
  const form = useForm<TabelaPrecoFormValues>({
    resolver: zodResolver(tabelaPrecoSchema) as any,
    defaultValues: { principal: "N", coeficiente: 0 },
  });

  async function onSubmit(data: TabelaPrecoFormValues) {
    const res = await createTabelaPreco(data);
    if ((res as any).error) {
      toast.error(String((res as any).error));
      return;
    }
    toast.success("Tabela de preço criada");
    router.push("/cadastros/tabela-preco");
  }

  return (
    <PageContainer title="Nova Tabela de Preço">
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
