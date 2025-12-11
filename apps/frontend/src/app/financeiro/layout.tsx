"use client";

import { InactivityProvider } from "@/components/inactivity-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { usePathname } from "next/navigation";
import { PanelLeftOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useEffect, useRef, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";

export default function FinanceiroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const atRoot = pathname === "/financeiro";
  const [isMobile, setIsMobile] = useState(false);
  const [moduleSidebarOpen, setModuleSidebarOpen] = useState(false);
  const [moduleSidebarCollapsed, setModuleSidebarCollapsed] = useState(false);
  const [lowRes, setLowRes] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const detect = () => {
      try {
        const w = Math.max(
          document?.documentElement?.clientWidth || 0,
          window.innerWidth || 0
        );
        const h = window.innerHeight || 0;
        setIsMobile(w < 768);
        setLowRes(w <= 1280 || h <= 720);
      } catch {}
    };
    detect();
    window.addEventListener("resize", detect);
    return () => window.removeEventListener("resize", detect);
  }, []);

  useEffect(() => {
    try {
      const v = localStorage.getItem("financeiro:sidebarCollapsed");
      if (v === "1") setModuleSidebarCollapsed(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (lowRes) {
      setModuleSidebarCollapsed(true);
      try {
        localStorage.setItem("financeiro:sidebarCollapsed", "1");
      } catch {}
    }
  }, [lowRes]);

  const toggleCollapsed = () => {
    setModuleSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("financeiro:sidebarCollapsed", next ? "1" : "0");
      } catch {}
      return next;
    });
  };

  return (
    <InactivityProvider>
      <DashboardLayout hideSidebar>
        <div className="relative h-full" ref={containerRef}>
          {atRoot ? (
            <main className="flex-1 overflow-auto">{children}</main>
          ) : (
            <div className="flex h-full">
              <aside
                className={`hidden md:block border-r overflow-y-auto transition-all duration-300 ${
                  moduleSidebarCollapsed ? "w-16" : "w-64"
                }`}
                style={{
                  background: "var(--ui-sidebar-bg)",
                  color: "var(--ui-sidebar-fg)",
                }}
              >
                <div className="flex items-center justify-between p-4 border-b">
                  {!moduleSidebarCollapsed && (
                    <span className="font-semibold">Financeiro</span>
                  )}
                  <button
                    onClick={toggleCollapsed}
                    className="p-1 hover:bg-muted transition-colors"
                    title={
                      moduleSidebarCollapsed ? "Expandir menu" : "Recolher menu"
                    }
                  >
                    <ChevronRight
                      className={`h-5 w-5 transition-transform duration-300 ${
                        moduleSidebarCollapsed ? "" : "rotate-180"
                      }`}
                    />
                  </button>
                </div>
                <Sidebar
                  scope="Financeiro"
                  collapsed={moduleSidebarCollapsed}
                  onExpand={() => setModuleSidebarCollapsed(false)}
                />
              </aside>

              {isMobile && (
                <div className="absolute top-2 left-2 z-30">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Abrir menu do financeiro"
                    className="bg-transparent hover:bg-transparent"
                    onClick={() => setModuleSidebarOpen(true)}
                  >
                    <PanelLeftOpen className="h-5 w-5" />
                  </Button>
                </div>
              )}

              {isMobile && (
                <Sheet
                  open={moduleSidebarOpen}
                  onOpenChange={setModuleSidebarOpen}
                >
                  <SheetContent
                    side="left"
                    className="w-64 p-0"
                    container={containerRef.current}
                    overlayClassName="bg-black/40 backdrop-blur-sm"
                  >
                    <Sidebar
                      scope="Financeiro"
                      collapsed={false}
                      onNavigate={() => setModuleSidebarOpen(false)}
                    />
                  </SheetContent>
                </Sheet>
              )}

              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          )}
        </div>
      </DashboardLayout>
    </InactivityProvider>
  );
}
