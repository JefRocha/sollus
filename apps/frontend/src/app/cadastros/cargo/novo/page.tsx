import { PageContainer } from "@/components/page-container";
import { CargoForm } from "../_components/cargo-form";

export default function NovoCargoPage() {
  return (
    <PageContainer
      title="Novo Cargo"
      description="Cadastre um novo cargo no sistema."
    >
      <CargoForm />
    </PageContainer>
  );
}
