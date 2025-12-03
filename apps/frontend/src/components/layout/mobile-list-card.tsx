import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MobileListCardProps {
    title: string
    subtitle?: string
    badges?: Array<{ label: string; variant?: "default" | "secondary" | "outline" }>
    onEdit?: () => void
    onDelete?: () => void
    onClick?: () => void
    className?: string
}

/**
 * Card para exibir itens de lista no mobile
 * Substitui a tabela em telas pequenas
 */
export function MobileListCard({
    title,
    subtitle,
    badges,
    onEdit,
    onDelete,
    onClick,
    className,
}: MobileListCardProps) {
    return (
        <Card
            className={cn(
                "relative cursor-pointer transition-shadow hover:shadow-md",
                className
            )}
            onClick={onClick}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">
                        <h3 className="font-semibold leading-none">{title}</h3>
                        {subtitle && (
                            <p className="text-sm text-muted-foreground">{subtitle}</p>
                        )}
                    </div>

                    {/* Menu de ações */}
                    {(onEdit || onDelete) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    className="shrink-0"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreVertical className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {onEdit && (
                                    <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation()
                                        onEdit()
                                    }}>
                                        Editar
                                    </DropdownMenuItem>
                                )}
                                {onDelete && (
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onDelete()
                                        }}
                                        className="text-destructive"
                                    >
                                        Excluir
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>

            {/* Badges */}
            {badges && badges.length > 0 && (
                <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1.5">
                        {badges.map((badge, index) => (
                            <Badge
                                key={index}
                                variant={badge.variant || "secondary"}
                                className="text-xs"
                            >
                                {badge.label}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            )}
        </Card>
    )
}
