import { PageContainer } from "@/components/page-container";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./_components/columns";
import { getCbos } from "./cbo.service";

export default async function CboPage() {
  const data = await getCbos();

  return (
    <PageContainer
      title="Cbo"
      description="Gerencie todos os seus cbo a partir daqui."
    >
      <DataTable
        columns={columns}
        data={data}
        filterBy="nome"
        createHref="/cbo/novo"
        createText="Novo Cbo"
      />
    </PageContainer>
  );
}
