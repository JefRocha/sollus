import { PageContainer } from "@/components/page-container";
import { CargoForm } from "../_components/cargo-form";
import { getCargoById } from "../cargo.service";

interface EditCargoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCargoPage({ params }: EditCargoPageProps) {
  const { id } = await params;
  const cargo = await getCargoById(Number(id));

  return (
    <PageContainer
      title="Editar Cargo"
      description="Edite as informações do cargo."
    >
      <CargoForm data={cargo} />
    </PageContainer>
  );
}
