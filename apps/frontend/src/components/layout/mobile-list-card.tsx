import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileListCardProps {
  title: string;
  subtitle?: string;
  badges?: Array<{
    label: string;
    variant?: "default" | "secondary" | "outline";
    className?: string;
  }>;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  className?: string;
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <Card
      className={cn(
        "relative cursor-pointer transition-all hover:shadow-lg hover:-translate-y-[2px] py-1 px-3 gap-0",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="py-0 px-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-sm truncate max-w-[40%]">
              {title}
            </span>
            {subtitle && (
              <span className="text-xs text-muted-foreground truncate max-w-[30%]">
                {subtitle}
              </span>
            )}
            {/* Badges movidos para a linha abaixo para melhorar responsividade */}
          </div>

          {/* Menu de ações */}
          {(onEdit || onDelete) && mounted && (
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
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                  >
                    Editar
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
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

      {badges && badges.length > 0 && (
        <CardContent className="pt-1 pb-2 px-0">
          <div className="flex flex-wrap gap-1">
            {badges.map((badge, index) => (
              <Badge
                key={index}
                variant={badge.variant || "secondary"}
                className={cn("text-[12px] py-1", badge.className)}
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
