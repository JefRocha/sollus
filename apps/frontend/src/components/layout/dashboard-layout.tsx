"use client";

import { useEffect, useRef, useState } from "react";
import { apiClientFetch } from "@/lib/api-client";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { PrivacyAcceptanceDialog } from "./privacy-acceptance-dialog";
import { PrivacyAcceptanceBar } from "./privacy-acceptance-bar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    name?: string;
    email?: string;
    administrador?: string;
    roles?: string[];
    displayName?: string;
  };
}

export function DashboardLayout({
  children,
  user: initialUser,
  hideSidebar = false,
}: DashboardLayoutProps & { hideSidebar?: boolean }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [lowRes, setLowRes] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<
    | {
        name?: string;
        email?: string;
        administrador?: string;
        roles?: string[];
        displayName?: string;
        dataAceitePolitica?: string;
      }
    | undefined
  >(initialUser);
  const pathname = usePathname();

  useEffect(() => {
    const detect = () => {
      try {
        const w = Math.max(
          typeof document !== "undefined"
            ? document.documentElement.clientWidth
            : 0,
          typeof window !== "undefined" ? window.innerWidth : 0
        );
        const h = typeof window !== "undefined" ? window.innerHeight : 0;
        // Considera baixa resolução próximo de 1280x720
        setLowRes(w <= 1280 || h <= 720);
        setIsMobile(w <= 767);
      } catch {}
    };
    detect();
    window.addEventListener("resize", detect);
    return () => window.removeEventListener("resize", detect);
  }, []);

  useEffect(() => {
    if (lowRes) {
      setSidebarCollapsed(true);
      try {
        window.localStorage.setItem("sidebarCollapsed", "1");
      } catch {}
    }
  }, [lowRes]);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem("sidebarCollapsed");
      if (v === "1") setSidebarCollapsed(true);
    } catch {}
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const r: any = await apiClientFetch("/api/auth/me"); // Corrigido para /api/auth/me
        console.log("[DashboardLayout] /api/auth/me response:", r);

        /* 
        // Lógica antiga removida, pois apiClientFetch já lida com Auth Headers
        const token = ...
        const res = await fetch("/api/me", ...) 
        */

        // Mapeamento correto da entidade Usuario (Sollus)
        const name = r?.colaborador?.pessoa?.nome || r?.login || r?.name;
        const email =
          r?.colaborador?.email || r?.colaborador?.pessoa?.email || r?.email;
        const login = r?.login;
        const displayName =
          r?.displayName ||
          name ||
          (email ? String(email).split("@")[0] : undefined) ||
          login ||
          undefined;
        const u = {
          name,
          email,
          administrador: r?.administrador, // Já vem "S" ou "N" do banco
          roles: r?.papel
            ? [r.papel.nome]
            : Array.isArray(r?.roles)
            ? r.roles
            : undefined,
          displayName,
          dataAceitePolitica: r?.dataAceitePolitica || r?.data_aceite_politica,
        };
        setUser(u);
      } catch (error) {
        // Se a chamada principal falhar, tenta carregar do localStorage como fallback
        if (!user) {
          try {
            const name = window.localStorage.getItem("user:name") || undefined;
            const email =
              window.localStorage.getItem("user:email") || undefined;
            const displayName =
              window.localStorage.getItem("user:displayName") || undefined;
            if (name || email || displayName) {
              setUser({ name, email, displayName });
            }
          } catch {}
        }
      }
    };
    loadUser();
  }, []);

  const autoHideSidebar = (() => {
    const p = pathname || "";
    if (/^\/cadastros(\/|$)/.test(p)) return true;
    if (/^\/financeiro(\/|$)/.test(p)) return true;
    return false;
  })();
  const sidebarEnabled = !hideSidebar && !autoHideSidebar;

  return (
    <div className="h-screen flex flex-col">
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        user={user}
        showMenuButton={!hideSidebar}
      />

      <div className="flex-1 flex overflow-hidden relative" ref={containerRef}>
        {/* Sidebar Desktop */}
        {sidebarEnabled && (
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
        )}

        {/* Sidebar Mobile */}
        {sidebarEnabled &&
          (isMobile ? (
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
          ) : (
            <Sheet open={sidebarOpen && lowRes} onOpenChange={setSidebarOpen}>
              <SheetContent
                side="left"
                className="w-64 p-0"
                container={containerRef.current}
                overlayClassName="bg-black/30 z-30"
              >
                <Sidebar
                  collapsed={false}
                  onNavigate={() => {
                    setSidebarOpen(false);
                    setSidebarCollapsed(true);
                    try {
                      window.localStorage.setItem("sidebarCollapsed", "1");
                    } catch {}
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
          ))}

        {/* Main Content */}
        <main className="flex-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="h-full">{children}</div>
        </main>
      </div>

      <Footer />
      {user &&
        !user.dataAceitePolitica &&
        (pathname === "/privacidade" ? (
          <PrivacyAcceptanceBar
            onAccept={() => {
              setUser((prev) =>
                prev
                  ? { ...prev, dataAceitePolitica: new Date().toISOString() }
                  : undefined
              );
            }}
          />
        ) : (
          <PrivacyAcceptanceDialog
            open={true}
            onAccept={() => {
              setUser((prev) =>
                prev
                  ? { ...prev, dataAceitePolitica: new Date().toISOString() }
                  : undefined
              );
            }}
          />
        ))}
    </div>
  );
}
