import { PageContainer } from "@/components/page-container";
import { CargoForm } from "../_components/cargo-form";
import * as React from "react";

export default function NovoCargoPage() {
  return (
    <PageContainer
      title="Novo Cargo"
      description="Cadastre um novo cargo no sistema."
    >
      <React.Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Carregando...</div>}>
        <CargoForm />
      </React.Suspense>
    </PageContainer>
  );
}
