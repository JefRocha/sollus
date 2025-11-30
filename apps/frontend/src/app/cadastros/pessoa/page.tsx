import { PageContainer } from "@/components/page-container";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./_components/columns";
import { getPessoas } from "@/actions/cadastros/pessoa-actions";

export default async function PessoaPage() {
  const result = await getPessoas({});
  const data = result.pessoas || [];

  return (
    <PageContainer title="Pessoas" description="Gerencie seus cadastros de pessoas.">
      <DataTable
        columns={columns}
        data={data}
        filterBy="nome"
        createHref="/cadastros/pessoa/novo"
        createText="Nova Pessoa"
      />
    </PageContainer>
  );
}
