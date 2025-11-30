import { PageContainer } from "@/components/page-container";
import { BancoForm } from "../../_components/banco-form";
import { getBancoById } from "@/actions/cadastros/banco-actions";
import { notFound } from "next/navigation";

interface EditarBancoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditarBancoPage(props: EditarBancoPageProps) {
  const params = await props.params;
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const result = await getBancoById(id);

  if (result.error || !result.banco) {
    return notFound();
  }


  return (
    <PageContainer
      title="Editar Banco"
      description="Edite as informações do banco."
    >
      <BancoForm initialData={result.banco} />
    </PageContainer>
  );

}
