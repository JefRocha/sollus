import { PageContainer } from "@/components/page-container";
import { UsuarioForm } from "../_components/usuario-form";
import { getUsuarioById } from "../usuario.service";

export default async function UsuarioPersistePage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const isEditing = id !== "novo";
  const data = isEditing ? await getUsuarioById(Number(id)) : undefined;

  const title = isEditing ? "Editar Usuario" : "Novo Usuario";
  const description = isEditing
    ? "Altere os dados do seu usuario aqui."
    : "Crie um novo usuario preenchendo o formulário abaixo.";

  return (
    <PageContainer title={title} description={description}>
      <UsuarioForm data={data} />
    </PageContainer>
  );
}
