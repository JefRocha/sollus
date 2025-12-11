import * as React from "react";
import { PaisForm } from "../_components/pais-form";
import { getPaisById } from "../pais.service";

export default async function PaisIdPage({ params }: any) {
  const isNew = params.id === "novo";
  const data = isNew ? null : await getPaisById(Number(params.id));
  return <PaisForm initialData={data} />;
}
