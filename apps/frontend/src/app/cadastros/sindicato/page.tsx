import { PageContainer } from "@/components/page-container";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./_components/columns";
import { getSindicatos } from "@/actions/cadastros/sindicato-actions";

export default async function SindicatoPage() {
  const result = await getSindicatos({});
  const data = result.sindicatos || [];
  return (
    <PageContainer title="Sindicatos" description={result.error ? `Erro: ${result.error}` : "Gerencie seus sindicatos."}>
      <DataTable columns={columns} data={data as any} filterBy="nome" createHref="/cadastros/sindicato/novo" createText="Novo Sindicato" />
    </PageContainer>
  );
}
