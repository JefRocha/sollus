"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Download,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronsRight,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
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

interface ColaboradorListClientProps {
  data: any[];
}

export function ColaboradorListClient({ data }: ColaboradorListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isMobile } = useMobileDetection();
  const [search, setSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [cardPageIndex, setCardPageIndex] = useState(0);
  const [cardPageSize, setCardPageSize] = useState(15);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    const v = searchParams?.get("view");
    if (v === "cards" || v === "table") {
      setViewMode(v);
      try {
        window.localStorage.setItem("colaboradorViewMode", v);
      } catch {}
      return;
    }
    try {
      const saved = window.localStorage.getItem("colaboradorViewMode");
      if (saved === "cards" || saved === "table") {
        setViewMode(saved as "cards" | "table");
      }
    } catch {}
  }, [searchParams]);

  const filteredData = useMemo(() => {
    let result = data ?? [];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item?.nome?.toLowerCase().includes(q) ||
          item?.pessoaModel?.nome?.toLowerCase().includes(q) ||
          item?.email?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [data, search]);

  const total = filteredData.length;
  const pageCount = Math.max(1, Math.ceil(total / cardPageSize));
  const clampedIndex = Math.min(cardPageIndex, pageCount - 1);
  const start = clampedIndex * cardPageSize;
  const end = start + cardPageSize;
  const pageItems = filteredData.slice(start, end);

  const cardPagination = (
    <div className="flex items-center justify-between space-x-2 py-2 shrink-0 border-t border-border/40">
      <div className="flex-1 text-sm text-muted-foreground">
        {filteredData.length} registro(s) encontrado(s).
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <p className="text-xs font-medium">Registros por página</p>
          <select
            value={cardPageSize}
            onChange={(e) => setCardPageSize(Number(e.target.value))}
            className="h-7 w-[64px] border border-input bg-transparent px-2 py-0.5 text-xs"
          >
            {[10, 15, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs font-medium">
            Página {clampedIndex + 1} de {pageCount}
          </div>
        </div>
        <div className="space-x-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCardPageIndex(0)}
            disabled={clampedIndex <= 0}
            aria-label="Primeira página"
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCardPageIndex((i) => Math.max(0, i - 1))}
            disabled={clampedIndex <= 0}
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() =>
              setCardPageIndex((i) => Math.min(pageCount - 1, i + 1))
            }
            disabled={clampedIndex >= pageCount - 1}
            aria-label="Próxima página"
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCardPageIndex(pageCount - 1)}
            disabled={clampedIndex >= pageCount - 1}
            aria-label="Última página"
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderCards = () => (
    <div className="h-full overflow-y-auto px-1 pb-3">
      <div className="space-y-2">
        {pageItems.map((c) => (
          <MobileListCard
            key={c.id}
            title={c?.pessoaModel?.nome || c?.nome || "Sem nome"}
            subtitle={c?.email || c?.pessoaModel?.email || "Sem e-mail"}
            onEdit={() =>
              router.push(
                `/cadastros/colaborador/${c.id}/editar?view=${viewMode}`
              )
            }
            onClick={() =>
              router.push(
                `/cadastros/colaborador/${c.id}/editar?view=${viewMode}`
              )
            }
          />
        ))}
        {filteredData.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum resultado encontrado.
          </p>
        )}
      </div>
    </div>
  );

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
            className="w-full transition-transform active:scale-[0.98]"
            onClick={() => router.push("/cadastros/colaborador/novo")}
          >
            <Plus className="mr-2 size-4" />
            Novo Colaborador
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
                    window.localStorage.setItem("colaboradorViewMode", next);
                  } catch {}
                  router.replace(`/cadastros/colaborador?view=${next}`, {
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
                  {selected?.pessoaModel?.nome || selected?.nome}
                </div>
                <div className="text-xs text-muted-foreground">
                  {selected?.email || selected?.pessoaModel?.email}
                </div>
                <div className="mt-3 flex gap-2">
                  <UIButton
                    onClick={() =>
                      router.push(
                        `/cadastros/colaborador/${selected.id}/editar?view=${viewMode}`
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
        mobileTitle="Ações - Colaborador"
        sidebarCollapsed={sidebarCollapsed}
      >
        <ListPageContent
          title="Colaboradores"
          description="Gerencie seus colaboradores."
          pagination={
            isMobile || viewMode === "cards" ? cardPagination : undefined
          }
        >
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
            renderCards()
          ) : (
            <DataTable
              columns={columns}
              data={filteredData}
              createHref="/cadastros/colaborador/novo"
              createText="Novo Colaborador"
              canCreate={false}
              onRowClick={(row: any) =>
                setSelected((prev: any) =>
                  prev && prev.id === row.id ? null : row
                )
              }
              flexibleHeight
            />
          )}
        </ListPageContent>
      </ListPageLayout>
    </PageContainer>
  );
}
