import { PageContainer } from "@/components/page-container";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./_components/columns";
import { getEstadosCivis } from "@/actions/cadastros/estado-civil-actions";
import { isMaster } from "@/lib/utils";

export default async function EstadoCivilPage() {
  const result = await getEstadosCivis({});
  const data = result.estados || [];
  return (
    <PageContainer title="Estado Civil" description={result.error ? `Erro: ${result.error}` : "Gerencie os estados civis."} wrapWithDashboardLayout={false}>
      <DataTable columns={columns} data={data as any} filterBy="nome" createHref="/cadastros/estado-civil/novo" createText="Novo Estado" canCreate={isMaster()} />
    </PageContainer>
  );
}
