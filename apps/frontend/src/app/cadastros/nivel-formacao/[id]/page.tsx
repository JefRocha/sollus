import { PageContainer } from "@/components/page-container";
import { NivelFormacaoForm } from "./../_components/nivel-formacao-form";
import { getNivelFormacaoById } from "./../nivel-formacao.service";

export default async function NivelFormacaoPersistePage({
    params,
}: {
    params: { id: string };
}) {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const isEditing = id !== "novo";
    const data = isEditing ? await getNivelFormacaoById(Number(id)) : undefined;

    const title = isEditing ? "Editar Nível de Formação" : "Novo Nível de Formação";
    const description = isEditing
        ? "Altere os dados do nível de formação aqui."
        : "Crie um novo nível de formação preenchendo o formulário abaixo.";

    return (
        <PageContainer title={title} description={description}>
            <NivelFormacaoForm data={data} />
        </PageContainer>
    );
}
