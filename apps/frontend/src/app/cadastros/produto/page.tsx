import { PageContainer } from "@/components/page-container";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./_components/columns";
import { produtoList } from "./produto.service";

export default async function ProdutoPage() {
  const data = await produtoList("");
  const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(data?.content) ? data.content : [];
  return (
    <PageContainer title="Produtos" description="Gerencie seus produtos.">
      <DataTable columns={columns} data={list as any} filterBy="nome" createHref="/cadastros/produto/novo" createText="Novo Produto" />
    </PageContainer>
  );
}
