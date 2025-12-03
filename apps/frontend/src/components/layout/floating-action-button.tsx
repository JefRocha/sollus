"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface FloatingActionButtonProps {
    onClick: () => void
    icon?: React.ReactNode
    label?: string
    className?: string
}

/**
 * Botão de ação flutuante (FAB) para mobile
 * Posicionado no canto inferior direito da tela
 */
export function FloatingActionButton({
    onClick,
    icon = <Plus className="size-5" />,
    label = "Adicionar",
    className,
}: FloatingActionButtonProps) {
    return (
        <Button
            onClick={onClick}
            size="lg"
            className={cn(
                "fixed bottom-6 right-6 z-40 size-14 rounded-full shadow-lg",
                className
            )}
            aria-label={label}
        >
            {icon}
        </Button>
    )
}
