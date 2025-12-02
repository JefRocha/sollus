import { PageContainer } from "@/components/page-container";
import { SetorForm } from "../_components/setor-form";
import { getSetorById } from "../setor.service";

export default async function SetorPersistePage({
    params,
}: {
    params: { id: string };
}) {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const isEditing = id !== "novo";
    const data = isEditing ? await getSetorById(Number(id)) : undefined;

    const title = isEditing ? "Editar Setor" : "Novo Setor";
    const description = isEditing
        ? "Altere os dados do setor aqui."
        : "Crie um novo setor preenchendo o formulário abaixo.";

    return (
        <PageContainer title={title} description={description}>
            <SetorForm data={data} />
        </PageContainer>
    );
}
