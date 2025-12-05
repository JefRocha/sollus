import { PageContainer } from "@/components/page-container";
import { CboForm } from "./../_components/cbo-form";
import * as React from "react";

export default async function CboNovoPage() {
  return (
    <PageContainer title="Novo Cbo" description="Crie um novo cbo preenchendo o formulário abaixo.">
      <React.Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Carregando...</div>}>
        <CboForm />
      </React.Suspense>
    </PageContainer>
  );
}
