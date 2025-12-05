import { produtoList } from "./produto.service";
import { ProdutoListClient } from "./_components/produto-list-client";
import * as React from "react";

export default async function ProdutoPage() {
  const data = await produtoList("");
  const list = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data)
    ? (data as any).data
    : Array.isArray((data as any)?.content)
    ? (data as any).content
    : [];
  return (
    <React.Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Carregando...</div>}>
      <ProdutoListClient data={list as any} />
    </React.Suspense>
  );
}
