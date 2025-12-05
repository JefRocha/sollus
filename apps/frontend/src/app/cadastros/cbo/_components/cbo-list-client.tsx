"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, PanelLeftClose, PanelLeftOpen } from "lucide-react";

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
import { useMobileDetection } from "@/hooks/use-mobile-detection";
import { columns } from "./columns";

interface CboListClientProps {
  data: any[];
}

export function CboListClient({ data }: CboListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMobile } = useMobileDetection();
  const [search, setSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    const v = searchParams?.get("view");
    if (v === "cards" || v === "table") {
      setViewMode(v);
      try {
        window.localStorage.setItem("cboViewMode", v);
      } catch {}
      return;
    }
    try {
      const saved = window.localStorage.getItem("cboViewMode");
      if (saved === "cards" || saved === "table") setViewMode(saved as any);
    } catch {}
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (data ?? []).filter(
      (c: any) =>
        (c?.nome || "").toLowerCase().includes(q) ||
        (c?.codigo || "").toLowerCase().includes(q) ||
        (c?.codigo1994 || "").toLowerCase().includes(q)
    );
  }, [data, search]);

  const sidebar = (
    <ListPageSidebar
      searchPlaceholder="Filtrar por nome/código..."
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
            onClick={() => router.push(`/cadastros/cbo/novo?view=${viewMode}`)}
          >
            <Plus className="mr-2 size-4" />
            Novo CBO
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
                    window.localStorage.setItem("cboViewMode", next);
                  } catch {}
                  router.replace(`/cadastros/cbo?view=${next}`, {
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
          {selected && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selecionado</p>
              <div className="rounded-md border p-3">
                <div className="text-sm font-semibold">
                  {selected?.nome || "Sem nome"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {(selected?.codigo && `2002: ${selected.codigo}`) ||
                    (selected?.codigo1994 && `1994: ${selected.codigo1994}`) ||
                    ""}
                </div>
                <div className="mt-3 flex gap-2">
                  <UIButton
                    onClick={() =>
                      router.push(
                        `/cadastros/cbo/${selected.id}?view=${viewMode}`
                      )
                    }
                  >
                    Editar
                  </UIButton>
                  <UIButton variant="outline" onClick={() => setSelected(null)}>
                    Limpar
                  </UIButton>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    />
  );

  return (
    <PageContainer contentClassName="p-0 pb-0">
      <ListPageLayout
        sidebar={sidebar}
        mobileTitle="Ações - CBO"
        sidebarCollapsed={sidebarCollapsed}
      >
        <ListPageContent title="CBO" description="Gerencie os códigos CBO.">
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
              {filtered.map((c: any) => (
                <MobileListCard
                  key={c.id}
                  title={c?.nome || "Sem nome"}
                  subtitle={
                    c?.codigo
                      ? `2002: ${c.codigo}`
                      : c?.codigo1994
                      ? `1994: ${c.codigo1994}`
                      : ""
                  }
                  onEdit={() =>
                    router.push(`/cadastros/cbo/${c.id}?view=${viewMode}`)
                  }
                  onClick={() =>
                    router.push(`/cadastros/cbo/${c.id}?view=${viewMode}`)
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
              createHref="/cadastros/cbo/novo"
              createText="Novo CBO"
              canCreate={false}
              onRowClick={(row: any) =>
                setSelected((prev: any) =>
                  prev && prev.id === row.id ? null : row
                )
              }
            />
          )}
        </ListPageContent>
      </ListPageLayout>
    </PageContainer>
  );
}
