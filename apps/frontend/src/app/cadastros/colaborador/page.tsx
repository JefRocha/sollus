import { PageContainer } from "@/components/page-container";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./_components/columns";
import { getColaboradores } from "@/actions/cadastros/colaborador-actions";

export default async function ColaboradorPage() {
  const result = await getColaboradores({});
  const data = Array.isArray(result.colaboradores) ? result.colaboradores : [];
  return (
    <PageContainer title="Colaboradores" description={result.error ? `Erro: ${result.error}` : "Gerencie seus colaboradores."}>
      <DataTable columns={columns} data={data as any} filterBy="nome" createHref="/colaborador/novo" createText="Novo Colaborador" />
    </PageContainer>
  );
}
