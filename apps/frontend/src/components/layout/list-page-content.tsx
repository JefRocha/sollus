import { cn } from "@/lib/utils";
import { ListPageHeader } from "./list-page-header";

interface ListPageContentProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  pagination?: React.ReactNode;
  className?: string;
}

/**
 * Área de conteúdo principal para páginas de listagem
 * Contém cabeçalho, área de tabela com scroll e paginação fixa
 */
export function ListPageContent({
  title,
  description,
  children,
  pagination,
  className,
}: ListPageContentProps) {
  return (
    <div className={cn("flex h-full flex-col module-panel pb-3", className)}>
      {/* Cabeçalho compacto - apenas se título fornecido */}
      {title && (
        <div className="shrink-0 px-6 pt-4">
          <ListPageHeader title={title} description={description} />
        </div>
      )}

      {/* Área de conteúdo (tabela) com scroll controlado pelo filho (DataTable) */}
      <div className="flex-1 overflow-hidden px-6">{children}</div>

      {/* Paginação fixa no rodapé */}
      {pagination && (
        <div className="shrink-0 border-t -mx-6 px-6 py-3">{pagination}</div>
      )}
    </div>
  );
}
