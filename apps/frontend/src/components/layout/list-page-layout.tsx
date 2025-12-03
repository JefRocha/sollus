"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMobileDetection } from "@/hooks/use-mobile-detection";
import { ReactNode, useState } from "react";

interface ListPageLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  mobileTitle?: string;
  className?: string;
  sidebarCollapsed?: boolean;
}

/**
 * Layout principal para páginas de listagem com sidebar
 * Desktop: Sidebar fixa à esquerda (280px) + conteúdo à direita
 * Mobile: Sidebar vira drawer/sheet acionado por botão hambúrguer
 */
export function ListPageLayout({
  sidebar,
  children,
  mobileTitle = "Menu",
  className,
  sidebarCollapsed = false,
}: ListPageLayoutProps) {
  const { isMobile } = useMobileDetection();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (isMobile) {
    return (
      <div className={cn("flex h-full flex-col", className)}>
        {/* Botão hambúrguer para mobile */}
        <div className="shrink-0 border-b bg-background p-4">
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>{mobileTitle}</SheetTitle>
              </SheetHeader>
              {sidebar}
            </SheetContent>
          </Sheet>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full", className)}>
      {/* Sidebar fixa no desktop */}
      <aside
        className={cn(
          "shrink-0 border-r transition-all duration-200",
          sidebarCollapsed ? "w-0 overflow-hidden" : "w-[250px]"
        )}
      >
        {sidebar}
      </aside>

      {/* Conteúdo principal */}
      <main
        className={cn(
          "overflow-hidden transition-all duration-200",
          sidebarCollapsed ? "flex-1" : "flex-1"
        )}
      >
        {children}
      </main>
    </div>
  );
}
