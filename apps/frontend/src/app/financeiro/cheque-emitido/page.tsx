import { getFinChequeEmitidoList } from "@/actions/financeiro/fin-cheque-emitido";
import { FinChequeEmitidoListClient } from "./_components/list-client";
import { PageContainer } from "@/components/page-container";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function FinChequeEmitidoPage() {
  const data = await getFinChequeEmitidoList();

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
      <FinChequeEmitidoListClient data={data || []} />
    </Suspense>
  );
}
