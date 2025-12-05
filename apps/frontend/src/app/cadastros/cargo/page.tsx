import { getCargos } from "./cargo.service";
import { CargoListClient } from "./_components/cargo-list-client";
import * as React from "react";

export default async function CargoPage() {
  const data = await getCargos();
  return (
    <React.Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Carregando...</div>}>
      <CargoListClient data={data as any[]} />
    </React.Suspense>
  );
}
