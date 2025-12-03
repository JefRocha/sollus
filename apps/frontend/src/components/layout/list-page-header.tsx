import { cn } from "@/lib/utils"

interface ListPageHeaderProps {
    title: string
    description?: string
    className?: string
}

/**
 * Cabeçalho compacto para páginas de listagem
 * Exibe título e descrição opcional de forma concisa
 */
export function ListPageHeader({
    title,
    description,
    className,
}: ListPageHeaderProps) {
    return (
        <div className={cn("space-y-1 pb-4", className)}>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
        </div>
    )
}
