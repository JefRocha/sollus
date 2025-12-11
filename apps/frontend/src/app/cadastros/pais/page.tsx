import * as React from "react";
import { PageContainer } from "@/components/page-container";
import { apiFetch } from "@/lib/api";
import { PaisListClient } from "./_components/pais-list-client";

async function getData() {
  const res = await apiFetch(["/api/pais"]);
  return Array.isArray(res) ? res : res.data || [];
}

export default async function PaisPage() {
  const data = await getData();

  return (
    <React.Suspense fallback={<div>Carregando...</div>}>
      <PageContainer title="Pais" wrapWithDashboardLayout={false}>
        <PaisListClient data={data} />
      </PageContainer>
    </React.Suspense>
  );
}
