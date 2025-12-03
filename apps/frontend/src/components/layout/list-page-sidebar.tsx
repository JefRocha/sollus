import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReactNode } from "react";

interface ListPageSidebarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchExtra?: ReactNode;
  actions?: ReactNode;
  headerActions?: ReactNode;
  filters?: ReactNode;
  bottomActions?: ReactNode;
  className?: string;
  variant?: "default" | "glass";
}

/**
 * Sidebar lateral com ações, busca e filtros para páginas de listagem
 * No desktop: sidebar fixa à esquerda
 * No mobile: conteúdo renderizado dentro de um drawer/sheet
 */
export function ListPageSidebar({
  searchPlaceholder = "Buscar...",
  searchValue,
  onSearchChange,
  searchExtra,
  actions,
  headerActions,
  filters,
  bottomActions,
  className,
  variant = "default",
}: ListPageSidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col gap-6 p-6 pb-10 transition-colors duration-300 overflow-y-auto",
        variant === "glass"
          ? "bg-background/60 backdrop-blur-sm border-r"
          : "bg-muted/30",
        className
      )}
    >
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b flex items-center justify-between py-0">
        <h2 className="text-lg font-semibold">AÇÕES</h2>
        {headerActions}
      </div>

      {/* Ações principais (ex: botão Novo) */}
      {actions && <div className="space-y-2">{actions}</div>}

      {/* Campo de busca */}
      {onSearchChange && (
        <div>
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
          {searchExtra}
        </div>
      )}

      {filters && <div className="space-y-2">{filters}</div>}

      {/* Espaçador para empurrar ações do rodapé para baixo */}
      <div className="flex-1" />

      {/* Ações do rodapé (ex: Exportar, Configurações) */}
      {bottomActions && (
        <div className="space-y-2 border-t pt-4">{bottomActions}</div>
      )}
    </div>
  );
}
