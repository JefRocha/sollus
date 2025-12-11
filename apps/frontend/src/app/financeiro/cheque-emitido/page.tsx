import { PageContainer } from "@/components/page-container";
import { getFinChequeEmitidoList } from "@/actions/financeiro/fin-cheque-emitido";
import { FinChequeEmitidoListClient } from "./_components/list-client";

export default async function FinChequeEmitidoPage() {
  const data = await getFinChequeEmitidoList();

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Cheques Emitidos</h1>
      </div>
      <FinChequeEmitidoListClient initialData={data} />
    </PageContainer>
  );
}
