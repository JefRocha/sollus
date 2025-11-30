import { PageContainer } from "@/components/page-container";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./_components/columns";
import { getTabelasPreco } from "@/actions/cadastros/tabela-preco-actions";

export default async function TabelaPrecoPage() {
  const result = await getTabelasPreco({});
  const data = result.tabelas || [];
  return (
    <PageContainer title="Tabelas de Preço" description={result.error ? `Erro: ${result.error}` : "Gerencie suas tabelas de preço."}>
      <DataTable columns={columns} data={data as any} filterBy="nome" createHref="/cadastros/tabela-preco/novo" createText="Nova Tabela" />
    </PageContainer>
  );
}

