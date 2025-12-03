"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Desktop */}
        <aside
          className={cn(
            "hidden md:block border-r overflow-y-auto transition-all duration-300 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
            sidebarCollapsed ? "w-16" : "w-64"
          )}
          style={{
            background: "var(--ui-sidebar-bg)",
            color: "var(--ui-sidebar-fg)",
          }}
        >
          <div className="flex items-center justify-between p-4 border-b">
            {!sidebarCollapsed && <span className="font-semibold">Menu</span>}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 hover:bg-muted rounded-md transition-colors"
              title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              <ChevronRight
                className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  sidebarCollapsed ? "" : "rotate-180"
                )}
              />
            </button>
          </div>
          <Sidebar collapsed={sidebarCollapsed} />
        </aside>

        {/* Sidebar Mobile */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar collapsed={false} />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="h-full">{children}</div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
