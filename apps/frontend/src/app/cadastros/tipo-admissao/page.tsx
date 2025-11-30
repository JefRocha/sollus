import { PageContainer } from "@/components/page-container";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./_components/columns";
import { getTiposAdmissao } from "@/actions/cadastros/tipo-admissao-actions";

export default async function TipoAdmissaoPage() {
  const result = await getTiposAdmissao({});
  const data = result.tipos || [];
  return (
    <PageContainer title="Tipos de Admissão" description={result.error ? `Erro: ${result.error}` : "Gerencie os tipos de admissão."}>
      <DataTable columns={columns} data={data as any} filterBy="nome" createHref="/cadastros/tipo-admissao/novo" createText="Novo Tipo" />
    </PageContainer>
  );
}

