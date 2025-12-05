"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/page-container";
import { SetorForm } from "../../_components/setor-form";
import { getSetorById, type Setor } from "@/app/cadastros/setor/setor.service";
import { toast } from "sonner";

export default function SetorEditarPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<Setor | undefined>(undefined);

  useEffect(() => {
    async function load() {
      const r = await getSetorById(Number(params.id));
      if (!r) {
        toast.error("Falha ao buscar setor");
        return;
      }
      setData(r as any);
    }
    load();
  }, [params.id]);

  

  return (
    <PageContainer title={`Editar Setor #${params.id}`}>
      <div className="space-y-4 pb-24">
        <SetorForm data={data} />
      </div>
    </PageContainer>
  );
}
