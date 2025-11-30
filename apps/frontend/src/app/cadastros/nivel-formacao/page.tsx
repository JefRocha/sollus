import { PageContainer } from "@/components/page-container";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./_components/columns";
import { getNiveisFormacao } from "@/actions/cadastros/nivel-formacao-actions";

export default async function NivelFormacaoPage() {
    const result = await getNiveisFormacao({});
    const data = result.niveis || [];
    return (
        <PageContainer title="Nível de Formação" description={result.error ? `Erro: ${result.error}` : "Gerencie os níveis de formação."}>
            <DataTable columns={columns} data={data as any} filterBy="nome" createHref="/cadastros/nivel-formacao/novo" createText="Novo Nível" />
        </PageContainer>
    );
}
