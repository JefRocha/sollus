import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ReactNode } from "react"

interface ListPageSidebarProps {
    searchPlaceholder?: string
    searchValue?: string
    onSearchChange?: (value: string) => void
    actions?: ReactNode
    filters?: ReactNode
    bottomActions?: ReactNode
    className?: string
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
    actions,
    filters,
    bottomActions,
    className,
}: ListPageSidebarProps) {
    return (
        <div
            className={cn(
                "flex h-full flex-col gap-6 bg-muted/30 p-6",
                className
            )}
        >
            {/* Cabeçalho */}
            <div>
                <h2 className="text-lg font-semibold">AÇÕES</h2>
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
                </div>
            )}

            {/* Filtros avançados */}
            {filters && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium">Filtros Avançados</h3>
                    <div className="space-y-2">{filters}</div>
                </div>
            )}

            {/* Espaçador para empurrar ações do rodapé para baixo */}
            <div className="flex-1" />

            {/* Ações do rodapé (ex: Exportar, Configurações) */}
            {bottomActions && (
                <div className="space-y-2 border-t pt-4">{bottomActions}</div>
            )}
        </div>
    )
}
