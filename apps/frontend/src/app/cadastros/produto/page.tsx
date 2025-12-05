import { produtoList } from "./produto.service";
import { ProdutoListClient } from "./_components/produto-list-client";

export default async function ProdutoPage() {
  const data = await produtoList("");
  const list = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data)
    ? (data as any).data
    : Array.isArray((data as any)?.content)
    ? (data as any).content
    : [];
  return <ProdutoListClient data={list as any} />;
}
