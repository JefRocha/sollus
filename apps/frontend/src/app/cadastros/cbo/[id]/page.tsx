import { PageContainer } from "@/components/page-container";
import { CboForm } from "./../_components/cbo-form";
import { getCboByIdServer } from "@/actions/cadastros/cbo-fetch";

export default async function CboPersistePage({
  params,
}: {
  params: { id: string };
}) {
  const resolvedParams = await params; // Await the params object
  const id = resolvedParams.id;
  const isEditing = id !== "novo";
  const data = isEditing ? await getCboByIdServer(Number(id)) : undefined;

  const title = isEditing ? "Editar Cbo" : "Novo Cbo";
  const description = isEditing
    ? "Altere os dados do seu cbo aqui."
    : "Crie um novo cbo preenchendo o formulário abaixo.";

  return (
    <PageContainer title={title} description={description} wrapWithDashboardLayout={false}>
      <CboForm data={data} />
    </PageContainer>
  );
}
