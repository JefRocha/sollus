import { PageContainer } from "@/components/page-container";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./_components/columns";
import { apiFetch } from "@/lib/api";

async function getSetores(input: { q?: string; field?: string } = {}) {
  const q = input.q?.trim();
  const field = input.field || "nome";
  const base = `/setor?page=1&limit=100`;
  const filter = q
    ? q.includes("$cont") || q.includes("$eq") || q.includes("$between")
      ? `${base}&filter=${encodeURIComponent(q)}`
      : `${base}&filter=${field}||$cont||${encodeURIComponent(q)}`
    : base;
  try {
    const res = await apiFetch<any>(filter);
    return { setores: res.data || res.content || res || [] };
  } catch (e: any) {
    return { setores: [], error: e?.message || "Erro ao buscar setores" };
  }
}

export default async function SetorPage() {
  const result = await getSetores({});
  const data = result.setores || [];
  return (
    <PageContainer title="Setores" description={result.error ? `Erro: ${result.error}` : "Gerencie seus setores."}>
      <DataTable columns={columns} data={data as any} filterBy="nome" createHref="/cadastros/setor/novo" createText="Novo Setor" />
    </PageContainer>
  );
}
