"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Download,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { ListPageLayout } from "@/components/layout/list-page-layout";
import { ListPageSidebar } from "@/components/layout/list-page-sidebar";
import { ListPageContent } from "@/components/layout/list-page-content";
import { MobileListCard } from "@/components/layout/mobile-list-card";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Button as UIButton } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { columns } from "./columns";
import { useMobileDetection } from "@/hooks/use-mobile-detection";

interface CargoListClientProps {
  data: any[];
}

export function CargoListClient({ data }: CargoListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMobile } = useMobileDetection();
  const [search, setSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  useEffect(() => {
    try {
      const v = searchParams?.get("view");
      if (v === "cards" || v === "table") {
        setViewMode(v as any);
        if (typeof window !== "undefined")
          localStorage.setItem("cargoViewMode", v);
        return;
      }
      const saved =
        typeof window !== "undefined"
          ? localStorage.getItem("cargoViewMode")
          : null;
      if (saved === "cards" || saved === "table") setViewMode(saved as any);
    } catch {}
  }, [searchParams]);
  useEffect(() => {
    try {
      if (typeof window !== "undefined")
        localStorage.setItem("cargoViewMode", viewMode);
    } catch {}
  }, [viewMode]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (data ?? []).filter((c) =>
      (c?.nome || "").toLowerCase().includes(q)
    );
  }, [data, search]);

  const sidebar = (
    <ListPageSidebar
      searchPlaceholder="Filtrar por nome..."
      searchValue={search}
      onSearchChange={setSearch}
      className="bg-gradient-to-b from-muted/40 via-muted/20 to-transparent"
      headerActions={
        !isMobile && (
          <UIButton
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed((v) => !v)}
            aria-label={sidebarCollapsed ? "Expandir painel" : "Ocultar painel"}
            className="text-muted-foreground hover:text-foreground"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </UIButton>
        )
      }
      actions={
        !isMobile && (
          <Button
            className="w-full"
            onClick={() => router.push("/cadastros/cargo/novo")}
          >
            <Plus className="mr-2 size-4" />
            Novo Cargo
          </Button>
        )
      }
      filters={
        <div className="space-y-4">
          {!isMobile && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Modo de exibição</p>
              <RadioGroup
                value={viewMode}
                onValueChange={(v) => {
                  const next = v as "table" | "cards";
                  setViewMode(next);
                  try {
                    if (typeof window !== "undefined")
                      localStorage.setItem("cargoViewMode", next);
                  } catch {}
                  router.replace(`/cadastros/cargo?view=${next}`, {
                    scroll: false,
                  });
                }}
                className="flex items-center gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="table" id="view-table" />
                  <Label
                    htmlFor="view-table"
                    className="text-sm cursor-pointer"
                  >
                    Tabela
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="cards" id="view-cards" />
                  <Label
                    htmlFor="view-cards"
                    className="text-sm cursor-pointer"
                  >
                    Cards
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>
      }
      bottomActions={
        <>
          <Button variant="outline" className="w-full">
            <Download className="mr-2 size-4" />
            Exportar
          </Button>
          <Button variant="ghost" className="w-full">
            <Settings className="mr-2 size-4" />
            Configurações
          </Button>
        </>
      }
    />
  );

  return (
    <PageContainer contentClassName="p-0 pb-0">
      <ListPageLayout
        sidebar={sidebar}
        mobileTitle="Ações - Cargo"
        sidebarCollapsed={sidebarCollapsed}
      >
        <ListPageContent title="Cargos" description="Gerencie os cargos.">
          <div className="px-1 pb-3 flex items-center justify-between gap-2">
            {sidebarCollapsed && (
              <UIButton
                variant="outline"
                onClick={() => setSidebarCollapsed(false)}
              >
                <PanelLeftOpen className="mr-2 size-4" />
                Mostrar Painel
              </UIButton>
            )}
          </div>
          {isMobile || viewMode === "cards" ? (
            <div className="space-y-2 p-3">
              {filtered.map((c) => (
                <MobileListCard
                  key={c.id}
                  title={c?.nome || "Sem nome"}
                  subtitle={c?.descricao || ""}
                  onEdit={() =>
                    router.push(`/cadastros/cargo/${c.id}?view=${viewMode}`)
                  }
                  onClick={() =>
                    router.push(`/cadastros/cargo/${c.id}?view=${viewMode}`)
                  }
                />
              ))}
              {filtered.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nenhum resultado encontrado.
                </p>
              )}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filtered}
              createHref="/cadastros/cargo/novo"
              createText="Novo Cargo"
              canCreate={false}
              onRowClick={(row: any) =>
                router.push(`/cadastros/cargo/${row.id}?view=${viewMode}`)
              }
            />
          )}
        </ListPageContent>
      </ListPageLayout>
    </PageContainer>
  );
}
