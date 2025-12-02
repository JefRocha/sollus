import { PageContainer } from "@/components/page-container";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./_components/columns";
import { getMunicipios } from "@/actions/cadastros/municipio-actions";
import { isMaster } from "@/lib/utils";

export default async function MunicipioPage() {
  const result = await getMunicipios({});
  const data = result.municipios || [];
  return (
    <PageContainer title="Municípios" description={result.error ? `Erro: ${result.error}` : "Gerencie os municípios (IBGE)."}>
      <DataTable columns={columns} data={data as any} filterBy="nome" createHref="/cadastros/municipio/novo" createText="Novo Município" canCreate={isMaster()} />
    </PageContainer>
  );
}

