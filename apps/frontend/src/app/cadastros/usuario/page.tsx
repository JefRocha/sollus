import { PageContainer } from "@/components/page-container";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./_components/columns";
import { getUsuarios } from "./usuario.service";

export default async function UsuarioPage() {
  const data = await getUsuarios();

  return (
    <PageContainer
      title="Usuario"
      description="Gerencie todos os seus usuario a partir daqui."
    >
      <DataTable
        columns={columns}
        data={data}
        filterBy="nome"
        createHref="/usuario/novo"
        createText="Novo Usuario"
      />
    </PageContainer>
  );
}
