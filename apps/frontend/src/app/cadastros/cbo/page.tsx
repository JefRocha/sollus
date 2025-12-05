import { getCbos } from "./cbo.service";
import { CboListClient } from "./_components/cbo-list-client";
import * as React from "react";

export default async function CboPage() {
  const data = await getCbos();
  return (
    <React.Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Carregando...</div>}>
      <CboListClient data={data} />
    </React.Suspense>
  );
}
