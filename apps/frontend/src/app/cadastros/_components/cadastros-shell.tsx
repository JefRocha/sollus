"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { PanelLeftOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function CadastrosShell({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const detect = () => {
      try {
        const w = Math.max(
          document?.documentElement?.clientWidth || 0,
          window.innerWidth || 0
        );
        setIsMobile(w < 768);
      } catch {}
    };
    detect();
    window.addEventListener("resize", detect);
    return () => window.removeEventListener("resize", detect);
  }, []);

  return (
    <div className="flex h-full relative" ref={containerRef}>
      {!isMobile && (
        <aside className={cn("hidden md:block border-r w-64")}>
          <Sidebar collapsed={false} />
        </aside>
      )}

      {isMobile && (
        <div className="absolute top-2 left-2 z-30">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Abrir menu"
            className="bg-transparent hover:bg-transparent"
            onClick={() => setSidebarOpen(true)}
          >
            <PanelLeftOpen className="h-5 w-5" />
          </Button>
        </div>
      )}

      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="left"
            className="w-64 p-0"
            container={containerRef.current}
            overlayClassName="bg-black/40 backdrop-blur-sm"
          >
            <Sidebar
              collapsed={false}
              onNavigate={() => setSidebarOpen(false)}
            />
          </SheetContent>
        </Sheet>
      )}

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
