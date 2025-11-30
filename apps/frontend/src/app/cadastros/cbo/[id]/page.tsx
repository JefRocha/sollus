import { PageContainer } from "@/components/page-container";
import { CboForm } from "./../_components/cbo-form";
import { getCboById } from "./../cbo.service";

export default async function CboPersistePage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const isEditing = id !== "novo";
  const data = isEditing ? await getCboById(Number(id)) : undefined;

  const title = isEditing ? "Editar Cbo" : "Novo Cbo";
  const description = isEditing
    ? "Altere os dados do seu cbo aqui."
    : "Crie um novo cbo preenchendo o formulário abaixo.";

  return (
    <PageContainer title={title} description={description}>
      <CboForm data={data} />
    </PageContainer>
  );
}
