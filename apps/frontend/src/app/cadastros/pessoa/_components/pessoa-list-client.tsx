"use client";

import { ListPageLayout } from "@/components/layout/list-page-layout";
import { ListPageSidebar } from "@/components/layout/list-page-sidebar";
import { ListPageContent } from "@/components/layout/list-page-content";
import { FloatingActionButton } from "@/components/layout/floating-action-button";
import { MobileListCard } from "@/components/layout/mobile-list-card";
import { DataTable } from "@/components/data-table/data-table";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { useMobileDetection } from "@/hooks/use-mobile-detection";
import {
  Plus,
  Download,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button as UIButton } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { columns, Pessoa } from "./columns";

interface PessoaListClientProps {
  data: Pessoa[];
}

export function PessoaListClient({ data }: PessoaListClientProps) {
  const router = useRouter();
  const { isMobile } = useMobileDetection();
  const [searchValue, setSearchValue] = useState("");
  const [selected, setSelected] = useState<Pessoa | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hovered, setHovered] = useState<Pessoa | null>(null);
  const [tipoFilter, setTipoFilter] = useState<"" | "F" | "J">("");
  const [roleFilters, setRoleFilters] = useState<{ [k: string]: boolean }>({
    cliente: false,
    fornecedor: false,
    transportadora: false,
    colaborador: false,
    contador: false,
  });
  const [cardPageIndex, setCardPageIndex] = useState(0);
  const [cardPageSize, setCardPageSize] = useState(15);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dataTablePageSize", String(cardPageSize));
    }
  }, [cardPageSize]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSize = localStorage.getItem("dataTablePageSize");
      if (savedSize) {
        const n = parseInt(savedSize, 10);
        if (!Number.isNaN(n)) setCardPageSize(n);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pessoaViewMode", viewMode);
    }
  }, [viewMode]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pessoaViewMode");
      if (saved === "cards" || saved === "table")
        setViewMode(saved as "table" | "cards");
    }
  }, []);

  // Filtrar dados baseado na busca
  const filteredData = data
    .filter((pessoa) =>
      pessoa.nome.toLowerCase().includes(searchValue.toLowerCase())
    )
    .filter((pessoa) => (tipoFilter ? pessoa.tipo === tipoFilter : true))
    .filter((pessoa) => {
      const checks: Array<[boolean, boolean]> = [
        [roleFilters.cliente, pessoa.eh_cliente === "S"],
        [roleFilters.fornecedor, pessoa.eh_fornecedor === "S"],
        [roleFilters.transportadora, pessoa.eh_transportadora === "S"],
        [roleFilters.colaborador, pessoa.eh_colaborador === "S"],
        [roleFilters.contador, pessoa.eh_contador === "S"],
      ];
      const active = checks.filter(([on]) => on);
      if (active.length === 0) return true;
      return active.every(([, ok]) => ok);
    });

  useEffect(() => {
    setCardPageIndex(0);
  }, [searchValue, tipoFilter, roleFilters, viewMode]);

  // Sidebar com ações e filtros
  const sidebar = (
    <ListPageSidebar
      searchPlaceholder="Filtrar por nome..."
      searchValue={searchValue}
      onSearchChange={setSearchValue}
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
          <Link href="/cadastros/pessoa/novo">
            <Button className="w-full transition-transform active:scale-[0.98]">
              <Plus className="mr-2 size-4" />
              Nova Pessoa
            </Button>
          </Link>
        )
      }
      filters={
        <div className="space-y-4">
          {!isMobile && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Modo de exibição</p>
              <RadioGroup
                value={viewMode}
                onValueChange={(v) => setViewMode(v as "table" | "cards")}
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
          {!selected && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Filtros</p>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Tipo</p>
                <Select
                  value={tipoFilter || "all"}
                  onValueChange={(v) =>
                    setTipoFilter(v === "all" ? "" : (v as "F" | "J"))
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="F">Física</SelectItem>
                    <SelectItem value="J">Jurídica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Papel</p>
                <Select
                  value={
                    roleFilters.cliente
                      ? "cliente"
                      : roleFilters.fornecedor
                      ? "fornecedor"
                      : roleFilters.transportadora
                      ? "transportadora"
                      : roleFilters.colaborador
                      ? "colaborador"
                      : roleFilters.contador
                      ? "contador"
                      : "all"
                  }
                  onValueChange={(v) =>
                    setRoleFilters({
                      cliente: v === "cliente",
                      fornecedor: v === "fornecedor",
                      transportadora: v === "transportadora",
                      colaborador: v === "colaborador",
                      contador: v === "contador",
                    })
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="fornecedor">Fornecedor</SelectItem>
                    <SelectItem value="transportadora">
                      Transportadora
                    </SelectItem>
                    <SelectItem value="colaborador">Colaborador</SelectItem>
                    <SelectItem value="contador">Contador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          {selected && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selecionado</p>
              <div className="rounded-md border p-3">
                <div className="text-sm font-semibold">{selected.nome}</div>
                <div className="text-xs text-muted-foreground">
                  {selected.email}
                </div>
                <div className="mt-3 flex gap-2">
                  <UIButton
                    onClick={() =>
                      router.push(`/cadastros/pessoa/${selected.id}/editar`)
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

  // Renderizar cards para mobile
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
    <div className="space-y-2">
      {pageItems.map((pessoa) => {
        const badges = [] as { label: string; className?: string }[];
        if (pessoa.eh_cliente === "S")
          badges.push({
            label: "Cliente",
            className: "bg-blue-100 text-blue-800 border-blue-200",
          });
        if (pessoa.eh_fornecedor === "S")
          badges.push({
            label: "Fornecedor",
            className: "bg-green-100 text-green-800 border-green-200",
          });
        if (pessoa.eh_transportadora === "S")
          badges.push({
            label: "Transportadora",
            className: "bg-orange-100 text-orange-800 border-orange-200",
          });
        if (pessoa.eh_colaborador === "S")
          badges.push({
            label: "Colaborador",
            className: "bg-purple-100 text-purple-800 border-purple-200",
          });
        if (pessoa.eh_contador === "S")
          badges.push({
            label: "Contador",
            className: "bg-teal-100 text-teal-800 border-teal-200",
          });

        return (
          <MobileListCard
            key={pessoa.id}
            title={pessoa.nome}
            subtitle={pessoa.email}
            badges={badges}
            onEdit={() => router.push(`/cadastros/pessoa/${pessoa.id}/editar`)}
            onClick={() => router.push(`/cadastros/pessoa/${pessoa.id}/editar`)}
          />
        );
      })}
      {filteredData.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhum resultado encontrado.
        </p>
      )}
    </div>
  );

  // Paginação (extraída do DataTable)
  const pagination = (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        {filteredData.length} registro(s) encontrado(s).
      </div>
    </div>
  );

  return (
    <PageContainer contentClassName="p-0 pb-4">
      <ListPageLayout
        sidebar={sidebar}
        mobileTitle="Ações - Pessoas"
        sidebarCollapsed={sidebarCollapsed}
      >
        <ListPageContent
          title="Pessoas"
          description="Gerencie seus cadastros de pessoas."
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
            <div className="flex flex-wrap gap-2">
              {tipoFilter && (
                <UIButton variant="secondary" onClick={() => setTipoFilter("")}>
                  {tipoFilter === "F" ? "Física" : "Jurídica"}
                </UIButton>
              )}
              {Object.entries(roleFilters).map(([k, v]) =>
                v ? (
                  <UIButton
                    key={k}
                    variant="secondary"
                    onClick={() =>
                      setRoleFilters((r) => ({ ...r, [k]: false }))
                    }
                  >
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </UIButton>
                ) : null
              )}
            </div>
          </div>
          {isMobile || viewMode === "cards" ? (
            renderCards()
          ) : (
            <DataTable
              columns={columns}
              data={filteredData}
              createHref="/cadastros/pessoa/novo"
              createText="Nova Pessoa"
              canCreate={false}
              onRowClick={(row) =>
                setSelected((prev) => (prev && prev.id === row.id ? null : row))
              }
              onRowHover={(row) => setHovered(row)}
            />
          )}
        </ListPageContent>
      </ListPageLayout>

      {/* FAB para mobile */}
      {isMobile && (
        <FloatingActionButton
          onClick={() => router.push("/cadastros/pessoa/novo")}
          label="Nova Pessoa"
        />
      )}
    </PageContainer>
  );
}
