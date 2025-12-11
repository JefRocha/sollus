import { getBancoContaCaixaList } from "@/actions/financeiro/banco-conta-caixa";
import { BancoContaCaixaListClient } from "./_components/banco-conta-caixa-list-client";
import { PageContainer } from "@/components/page-container";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function BancoContaCaixaPage() {
  // Fetch data directly on the server
  const data = await getBancoContaCaixaList();

  return (
    <Suspense
      fallback={
        <PageContainer wrapWithDashboardLayout={false}>
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </PageContainer>
      }
    >
      <BancoContaCaixaListClient data={data || []} />
    </Suspense>
  );
}
