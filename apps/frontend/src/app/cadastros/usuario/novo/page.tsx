import { PageContainer } from "@/components/page-container";
import { UsuarioForm } from "../_components/usuario-form";

export default async function UsuarioNovoPage() {
  return (
    <PageContainer title="Novo Usuario" description="Crie um novo usuario preenchendo o formulário abaixo.">
      <UsuarioForm />
    </PageContainer>
  );
}
