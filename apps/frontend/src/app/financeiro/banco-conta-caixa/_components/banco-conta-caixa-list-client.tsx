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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button as UIButton } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { columns } from "./columns";
import { BancoContaCaixa } from "@/types/schemas/financeiro/banco-conta-caixa";

interface BancoContaCaixaListClientProps {
  data: BancoContaCaixa[];
}

export function BancoContaCaixaListClient({
  data,
}: BancoContaCaixaListClientProps) {
  const router = useRouter();
  const { isMobile } = useMobileDetection();
  const [searchValue, setSearchValue] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bancoContaCaixaViewMode");
      if (saved === "cards" || saved === "table")
        setViewMode(saved as "table" | "cards");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bancoContaCaixaViewMode", viewMode);
    }
  }, [viewMode]);

  const filteredData = data.filter((item) =>
    item.nome.toLowerCase().includes(searchValue.toLowerCase())
  );

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
          <Link href="/financeiro/banco-conta-caixa/novo">
            <Button className="w-full transition-transform active:scale-[0.98]">
              <Plus className="mr-2 size-4" />
              Novo Banco
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

  const renderCards = () => (
    <div className="space-y-2">
      {filteredData.map((item) => (
        <MobileListCard
          key={item.id}
          title={item.nome}
          subtitle={item.tipo}
          onEdit={() =>
            router.push(`/financeiro/banco-conta-caixa/${item.id}/editar`)
          }
          onClick={() =>
            router.push(`/financeiro/banco-conta-caixa/${item.id}/editar`)
          }
        />
      ))}
      {filteredData.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhum resultado encontrado.
        </p>
      )}
    </div>
  );

  return (
    <PageContainer contentClassName="p-0 pb-0" wrapWithDashboardLayout={false}>
      <ListPageLayout
        sidebar={sidebar}
        mobileTitle="Ações - Bancos"
        sidebarCollapsed={sidebarCollapsed}
      >
        <ListPageContent
          title="Bancos e Caixas"
          description="Gerencie suas contas bancárias e caixas."
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
              createHref="/financeiro/banco-conta-caixa/novo"
              createText="Novo Banco"
              canCreate={false}
              flexibleHeight
              density="compact"
            />
          )}
        </ListPageContent>
      </ListPageLayout>

      {isMobile && (
        <FloatingActionButton
          onClick={() => router.push("/financeiro/banco-conta-caixa/novo")}
          label="Novo Banco"
        />
      )}
    </PageContainer>
  );
}
