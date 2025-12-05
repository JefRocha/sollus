import { getColaboradores } from "@/actions/cadastros/colaborador-actions";
import { ColaboradorListClient } from "./_components/colaborador-list-client";

export default async function ColaboradorPage() {
  const result = await getColaboradores({});
  const data = Array.isArray(result.colaboradores) ? result.colaboradores : [];
  return <ColaboradorListClient data={data as any} />;
}
