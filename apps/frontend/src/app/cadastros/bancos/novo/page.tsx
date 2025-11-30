import { PageContainer } from "@/components/layout/page-container";
import { BancoForm } from "../_components/banco-form";

export default function NovoBancoPage() {
  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Adicionar Novo Banco</h1>
      </div>
      <BancoForm />
    </PageContainer>
  );
}
