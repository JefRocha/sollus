import { PageContainer } from "@/components/page-container";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./_components/columns";
import { getMunicipios } from "@/actions/cadastros/municipio-actions";

export default async function MunicipioPage() {
  const result = await getMunicipios({});
  const data = result.municipios || [];
  console.log("Município result:", result);
  console.log("Município data:", data);
  return (
    <PageContainer title="Municípios" description={result.error ? `Erro: ${result.error}` : "Gerencie os municípios (IBGE)."}>
      <DataTable columns={columns} data={data as any} filterBy="nome" createHref="/cadastros/municipio/novo" createText="Novo Município" />
    </PageContainer>
  );
}

