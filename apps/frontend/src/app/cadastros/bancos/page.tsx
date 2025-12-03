import { PageContainer } from "@/components/page-container";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./_components/columns";
import { apiFetch } from "@/lib/api";

async function getBancos(input: { q?: string; field?: string } = {}) {
  const q = input.q?.trim();
  const field = input.field || "nome";
  const base = `/banco?page=1&limit=100`;
  const filter = q
    ? q.includes("$cont") || q.includes("$eq") || q.includes("$between")
      ? `${base}&filter=${encodeURIComponent(q)}`
      : `${base}&filter=${field}||$cont||${encodeURIComponent(q)}`
    : base;
  try {
    const res = await apiFetch<any>(filter);
    // Adaptação para o retorno da API que pode ser array direto ou objeto paginado
    const bancos = Array.isArray(res) ? res : (res.data || res.content || []);
    return { bancos };
  } catch (e: any) {
    return { bancos: [], error: e?.message || "Erro ao buscar bancos" };
  }
}

export default async function BancosPage() {
  const result = await getBancos({});
  const data = result.bancos || [];

  return (
    <PageContainer title="Bancos" description={result.error ? `Erro: ${result.error}` : "Gerencie seus bancos."}>
      <DataTable
        columns={columns}
        data={data}
        filterBy="nome"
        createHref="/cadastros/bancos/novo"
        createText="Novo Banco"
      />
    </PageContainer>
  );
}