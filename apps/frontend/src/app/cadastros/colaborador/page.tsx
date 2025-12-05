import { getColaboradores } from "@/actions/cadastros/colaborador-actions";
import { ColaboradorListClient } from "./_components/colaborador-list-client";
import * as React from "react";

export default async function ColaboradorPage() {
  const result = await getColaboradores({});
  const data = Array.isArray(result.colaboradores) ? result.colaboradores : [];
  return (
    <React.Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Carregando...</div>}>
      <ColaboradorListClient data={data as any} />
    </React.Suspense>
  );
}
