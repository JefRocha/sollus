import { PageContainer } from "@/components/page-container";
import { BancoForm } from "../_components/banco-form";

export default function NovoBancoPage() {
  return (
    <PageContainer title="Novo Banco" description="Cadastre um novo banco.">
      <BancoForm />
    </PageContainer>
  );
}
