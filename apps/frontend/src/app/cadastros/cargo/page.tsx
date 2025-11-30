import { PageContainer } from "@/components/page-container";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./_components/columns";
import { getCargos } from "./cargo.service";

export default async function CargoPage() {
  const data = await getCargos();

  return (
    <PageContainer
      title="Cargo"
      description="Gerencie todos os seus cargo a partir daqui."
    >
      <DataTable
        columns={columns}
        data={data}
        filterBy="nome"
        createHref="/cadastros/cargo/novo"
        createText="Novo Cargo"
      />
    </PageContainer>
  );
}
