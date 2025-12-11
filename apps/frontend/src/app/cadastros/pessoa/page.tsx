import {
  getPessoas,
  PessoaListQuery,
} from "@/actions/cadastros/pessoa-actions";
import { PessoaListClient } from "./_components/pessoa-list-client";
import { PageContainer } from "@/components/page-container";
import React from "react";

interface SearchParams {
  page?: string;
  limit?: string;
  q?: string;
  field?: string;
  tipo?: string;
  role?: string;
  sort?: string;
}

interface PessoaPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function PessoaPage({ searchParams }: PessoaPageProps) {
  const params = await searchParams;

  // Helper mais simples e type-safe
  const getParam = (key: keyof SearchParams): string | undefined => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const query: PessoaListQuery = {
    page: Number(getParam("page") || 1),
    limit: Number(getParam("limit") || 15),
    q: getParam("q"),
    field: getParam("field") || "nome",
    tipo:
      getParam("tipo") === "F" || getParam("tipo") === "J"
        ? (getParam("tipo") as "F" | "J")
        : undefined,
    role: getParam("role") as any,
    sort: getParam("sort"),
  };

  const result = await getPessoas(query);

  return (
    <React.Suspense
      fallback={
        <div className="p-4 text-sm text-muted-foreground">Carregando...</div>
      }
    >
      <PessoaListClient
        data={result.pessoas || []}
        serverPaged
        initialQuery={query}
        total={result.total}
        page={result.page}
      />
    </React.Suspense>
  );
}
