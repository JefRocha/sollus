import { PageContainer } from "@/components/page-container";
import { BancoForm } from "../_components/banco-form";
import * as React from "react";

export default function NovoBancoPage() {
  return (
    <PageContainer title="Novo Banco" description="Cadastre um novo banco.">
      <React.Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Carregando...</div>}>
        <BancoForm />
      </React.Suspense>
    </PageContainer>
  );
}
