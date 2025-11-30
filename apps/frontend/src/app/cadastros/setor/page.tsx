import { PageContainer } from "@/components/page-container";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./_components/columns";
import { getSetores } from "@/actions/cadastros/setor-actions";

export default async function SetorPage() {
  const result = await getSetores({});
  const data = result.setores || [];
  return (
    <PageContainer title="Setores" description={result.error ? `Erro: ${result.error}` : "Gerencie seus setores."}>
      <DataTable columns={columns} data={data as any} filterBy="nome" createHref="/cadastros/setor/novo" createText="Novo Setor" />
    </PageContainer>
  );
}

