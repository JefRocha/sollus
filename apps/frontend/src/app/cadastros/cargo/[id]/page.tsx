import { PageContainer } from "@/components/page-container";
import { CargoForm } from "../_components/cargo-form";
import { getCargos } from "../cargo.service";
import { notFound } from "next/navigation";

interface EditCargoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCargoPage({ params }: EditCargoPageProps) {
  const { id } = await params;
  const idNum = Number(id);
  if (isNaN(idNum)) {
    return notFound();
  }
  const list = await getCargos();
  const cargo = list.find((c) => c.id === idNum);
  if (!cargo) {
    return notFound();
  }

  return (
    <PageContainer
      title="Editar Cargo"
      description="Edite as informações do cargo."
    >
      <CargoForm data={cargo} />
    </PageContainer>
  );
}
