"use client";

import { useEffect, useState } from "react";
import { apiClientFetch } from "@/lib/api-client";
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [lowRes, setLowRes] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string; administrador?: string; roles?: string[]; displayName?: string } | undefined>(undefined);

  useEffect(() => {
    const detect = () => {
      try {
        const w = window.innerWidth;
        const h = window.innerHeight;
        setLowRes(w < 1366 || h < 768);
      } catch {}
    };
    detect();
    window.addEventListener("resize", detect);
    return () => window.removeEventListener("resize", detect);
  }, []);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem("sidebarCollapsed");
      if (v === "1") setSidebarCollapsed(true);
    } catch {}
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const r = await apiClientFetch<any>('/api/auth/me');
        const name = r?.colaborador?.pessoa?.nome || r?.nome || r?.name;
        const email = r?.colaborador?.pessoa?.email || r?.email;
        const login = r?.login || r?.username;
        const displayName = name || (email ? String(email).split('@')[0] : undefined) || login || undefined;
        const u = {
          name,
          email,
          administrador: r?.administrador ?? (Array.isArray(r?.roles) && r.roles.includes('ADMIN') ? 'S' : undefined),
          roles: Array.isArray(r?.roles) ? r.roles : undefined,
          displayName,
        };
        setUser(u);
      } catch (error) {
        console.error("Falha ao buscar dados do usuário:", error);
        // Se a chamada principal falhar, tenta carregar do localStorage como fallback
        if (!user) {
          try {
            const name = window.localStorage.getItem('user:name') || undefined;
            const email = window.localStorage.getItem('user:email') || undefined;
            const displayName = window.localStorage.getItem('user:displayName') || undefined;
            if (name || email || displayName) {
              setUser({ name, email, displayName });
            }
          } catch {}
        }
      }
    };
    loadUser();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} user={user} />

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
              onClick={() => {
                setSidebarCollapsed((prev) => {
                  const next = !prev;
                  try {
                    window.localStorage.setItem(
                      "sidebarCollapsed",
                      next ? "1" : "0"
                    );
                  } catch {}
                  return next;
                });
              }}
              className="p-1 hover:bg-muted transition-colors"
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
          <Sidebar
            collapsed={sidebarCollapsed}
            onNavigate={() => {
              if (lowRes) {
                setSidebarCollapsed(true);
                try {
                  window.localStorage.setItem("sidebarCollapsed", "1");
                } catch {}
              }
            }}
            onExpand={() => {
              setSidebarCollapsed(false);
              try {
                window.localStorage.setItem("sidebarCollapsed", "0");
              } catch {}
            }}
          />
        </aside>

        {/* Sidebar Mobile */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar
              collapsed={false}
              onNavigate={() => {
                setSidebarOpen(false);
                if (lowRes) {
                  setSidebarCollapsed(true);
                  try {
                    window.localStorage.setItem("sidebarCollapsed", "1");
                  } catch {}
                }
              }}
              onExpand={() => {
                setSidebarCollapsed(false);
                try {
                  window.localStorage.setItem("sidebarCollapsed", "0");
                } catch {}
              }}
            />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="h-full">{children}</div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
