"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  Download,
  Settings,
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
import { useMobileDetection } from "@/hooks/use-mobile-detection";
import { columns } from "./columns";

interface ProdutoListClientProps {
  data: any[];
}

export function ProdutoListClient({ data }: ProdutoListClientProps) {
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
        localStorage.setItem("produtoViewMode", v);
      } catch {}
      return;
    }
    try {
      const saved = localStorage.getItem("produtoViewMode");
      if (saved === "cards" || saved === "table") setViewMode(saved as any);
    } catch {}
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (data ?? []).filter((p: any) =>
      (p?.nome || "").toLowerCase().includes(q)
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
            onClick={() =>
              router.push(`/cadastros/produto/novo?view=${viewMode}`)
            }
          >
            <Plus className="mr-2 size-4" />
            Novo Produto
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
                    localStorage.setItem("produtoViewMode", next);
                  } catch {}
                  router.replace(`/cadastros/produto?view=${next}`, {
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
                  {(() => {
                    const c = Number(selected?.valorCompra ?? 0);
                    const v = Number(selected?.valorVenda ?? 0);
                    const nf = (n: number) => {
                      try {
                        return new Intl.NumberFormat("pt-BR", {
                          minimumFractionDigits: 2,
                        }).format(n);
                      } catch {
                        return String(n);
                      }
                    };
                    return `Compra: ${nf(c)}  •  Venda: ${nf(v)}`;
                  })()}
                </div>
                <div className="mt-3 flex gap-2">
                  <UIButton
                    onClick={() =>
                      router.push(
                        `/cadastros/produto/${selected.id}?view=${viewMode}`
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
    <PageContainer contentClassName="p-0 pb-0" wrapWithDashboardLayout={false}>
      <ListPageLayout
        sidebar={sidebar}
        mobileTitle="Ações - Produto"
        sidebarCollapsed={sidebarCollapsed}
      >
        <ListPageContent title="Produtos" description="Gerencie seus produtos.">
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
              {filtered.map((p: any) => (
                <MobileListCard
                  key={p.id}
                  title={p?.nome || "Sem nome"}
                  subtitle={(() => {
                    const c = Number(p?.valorCompra ?? 0);
                    const v = Number(p?.valorVenda ?? 0);
                    const nf = (n: number) => {
                      try {
                        return new Intl.NumberFormat("pt-BR", {
                          minimumFractionDigits: 2,
                        }).format(n);
                      } catch {
                        return String(n);
                      }
                    };
                    return `Compra: ${nf(c)}  •  Venda: ${nf(v)}`;
                  })()}
                  onEdit={() =>
                    router.push(`/cadastros/produto/${p.id}?view=${viewMode}`)
                  }
                  onClick={() =>
                    router.push(`/cadastros/produto/${p.id}?view=${viewMode}`)
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
              createHref="/cadastros/produto/novo"
              createText="Novo Produto"
              canCreate={false}
              flexibleHeight={true}
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
