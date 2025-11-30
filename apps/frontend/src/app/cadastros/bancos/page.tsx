import { PageContainer } from "@/components/page-container";
import { getBancos } from "@/actions/cadastros/banco-actions";
import { BancoClient } from "./_components/banco-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function BancosPage() {
  const result = await getBancos({});

  if (result.error) {
    return (
      <PageContainer title="Erro">
        <div className="text-red-500">{result.error}</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Bancos">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Bancos</h1>
        <Button asChild>
          <Link href="/cadastros/bancos/novo">Adicionar Banco</Link>
        </Button>
      </div>
      <BancoClient data={result.bancos ?? []} />
    </PageContainer>
  );
}