"use client";

import { InactivityProvider } from "@/components/inactivity-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, Boxes, UserCog, HandshakeIcon, Banknote, PanelLeftOpen, PanelLeftClose, Briefcase, Grid2x2, GraduationCap, MapPinned, ListOrdered, ChevronRight, LayoutDashboard } from "lucide-react";
import { isMaster } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useEffect, useRef, useState } from "react";

export default function CadastrosLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const atRoot = pathname === "/cadastros";
  const [isMobile, setIsMobile] = useState(false);
  const [moduleSidebarOpen, setModuleSidebarOpen] = useState(false);
  const [moduleSidebarCollapsed, setModuleSidebarCollapsed] = useState(false);
  const [lowRes, setLowRes] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };
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
      const v = localStorage.getItem("cadastros:sidebarCollapsed");
      if (v === "1") setModuleSidebarCollapsed(true);
    } catch {}
  }, []);
  useEffect(() => {
    if (lowRes) {
      setModuleSidebarCollapsed(true);
      try {
        localStorage.setItem("cadastros:sidebarCollapsed", "1");
      } catch {}
    }
  }, [lowRes]);
  const toggleCollapsed = () => {
    setModuleSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("cadastros:sidebarCollapsed", next ? "1" : "0");
      } catch {}
      return next;
    });
  };
  const items = [
    { label: "Dashboard", href: "/cadastros/dashboard", icon: LayoutDashboard },
    { label: "Pessoas", href: "/cadastros/pessoa", icon: Users },
    { label: "Produtos", href: "/cadastros/produto", icon: Boxes },
    { label: "Usuários", href: "/cadastros/usuario", icon: UserCog },
    { label: "Fornecedores", href: "/cadastros/fornecedor", icon: HandshakeIcon },
    { type: "group", label: "Outros Cadastros", items: [
      { label: "Bancos", href: "/cadastros/bancos", icon: Banknote },
      { label: "Cargo", href: "/cadastros/cargo", icon: Briefcase },
      { label: "CBO", href: "/cadastros/cbo", icon: ListOrdered },
      { label: "Setor", href: "/cadastros/setor", icon: Grid2x2 },
    ]},
    { type: "group", label: "Diversos", items: [
      { label: "Nível de Formação", href: "/cadastros/nivel-formacao", icon: GraduationCap, masterOnly: true },
      { label: "Estado Civil", href: "/cadastros/estado-civil", icon: Users, masterOnly: true },
      { label: "Tabela de Preços", href: "/cadastros/tabela-preco", icon: ListOrdered, masterOnly: true },
      { label: "Municípios", href: "/cadastros/municipio", icon: MapPinned, masterOnly: true },
    ]},
  ];

  return (
    <InactivityProvider>
      <DashboardLayout hideSidebar>
        <div className="relative h-full" ref={containerRef}>
          {atRoot ? (
            <main className="flex-1 overflow-auto">{children}</main>
          ) : (
            <div className="flex h-full">
              {/* Sidebar Desktop */}
              <aside
                className={cn(
                  "hidden md:block border-r px-3 py-4 space-y-2 transition-all duration-300",
                  moduleSidebarCollapsed ? "w-16" : "w-64"
                )}
                style={{ background: "var(--ui-sidebar-bg)", color: "var(--ui-sidebar-fg)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  {!moduleSidebarCollapsed && (
                    <h2 className="text-sm font-semibold text-muted-foreground">Cadastros</h2>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-transparent hover:bg-transparent"
                    aria-label={moduleSidebarCollapsed ? "Expandir" : "Recolher"}
                    onClick={toggleCollapsed}
                    title={moduleSidebarCollapsed ? "Expandir painel" : "Recolher painel"}
                  >
                    {moduleSidebarCollapsed ? (
                      <PanelLeftOpen className="h-4 w-4" />
                    ) : (
                      <PanelLeftClose className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <nav className="flex flex-col gap-0.5">
                  {items.map((it) => {
                    if ((it as any).masterOnly && !isMaster()) return null;
                    // heading removed; using groups for submenus
                    if ((it as any).type === "group") {
                      const isExpanded = expandedGroups.includes((it as any).label);
                      return (
                        <div key={(it as any).label} className="space-y-1">
                          <button
                            className={cn(
                              "w-full flex items-center rounded-md px-2 py-1.5 min-h-9 transition-colors",
                              moduleSidebarCollapsed ? "justify-center" : "justify-between",
                              isExpanded ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                            onClick={() => toggleGroup((it as any).label)}
                          >
                            <span className={cn(moduleSidebarCollapsed && "hidden")}>{(it as any).label}</span>
                            <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
                          </button>
                          {isExpanded && (
                            <div className={cn(moduleSidebarCollapsed ? "" : "ml-3 border-l pl-2")}> 
                              {((it as any).items as any[]).map((sub) => {
                                const SubIcon = (sub as any).icon as any;
                                const active = pathname.startsWith(sub.href);
                                return (
                                  <Link
                                    key={sub.href}
                                    href={sub.href}
                                    className={cn(
                                      "flex items-center rounded-md px-2 py-1.5 transition-colors min-h-9",
                                      moduleSidebarCollapsed ? "justify-center" : "gap-2",
                                      active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                    aria-current={active ? "page" : undefined}
                                    title={sub.label}
                                    onClick={() => {
                                      if (moduleSidebarCollapsed) {
                                        try {
                                          localStorage.setItem("cadastros:sidebarCollapsed", "0");
                                        } catch {}
                                        setModuleSidebarCollapsed(false);
                                      }
                                    }}
                                  >
                                    <SubIcon className="h-5 w-5" />
                                    {!moduleSidebarCollapsed && sub.label}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }
                    const Icon = (it as any).icon as any;
                    const active = pathname.startsWith(it.href);
                    return (
                      <Link
                        key={it.href}
                        href={it.href}
                        className={cn(
                          "flex items-center rounded-md px-2 py-1.5 transition-colors min-h-9",
                          moduleSidebarCollapsed ? "justify-center" : "gap-2",
                          active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                        aria-current={active ? "page" : undefined}
                        title={it.label}
                        onClick={() => {
                          if (moduleSidebarCollapsed) {
                            try {
                              localStorage.setItem("cadastros:sidebarCollapsed", "0");
                            } catch {}
                            setModuleSidebarCollapsed(false);
                          }
                        }}
                      >
                        <Icon className="h-5 w-5" />
                        {!moduleSidebarCollapsed && it.label}
                      </Link>
                    );
                  })}
                </nav>
              </aside>

              {/* Toggle Mobile */}
              {isMobile && (
                <div className="absolute top-2 left-2 z-30">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Abrir menu de cadastros"
                    className="bg-transparent hover:bg-transparent"
                    onClick={() => setModuleSidebarOpen(true)}
                  >
                    <PanelLeftOpen className="h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* Sidebar Mobile */}
              {isMobile && (
                <Sheet open={moduleSidebarOpen} onOpenChange={setModuleSidebarOpen}>
                  <SheetContent
                    side="left"
                    className="w-64 p-0"
                    container={containerRef.current}
                    overlayClassName="bg-black/40 backdrop-blur-sm"
                  >
                    <div className="px-4 py-4 space-y-2" style={{ background: "var(--ui-sidebar-bg)", color: "var(--ui-sidebar-fg)" }}>
                      <h2 className="text-sm font-semibold text-muted-foreground mb-2">Cadastros</h2>
                      <nav className="flex flex-col gap-0.5">
                        {items.map((it) => {
                          if ((it as any).masterOnly && !isMaster()) return null;
                          if ((it as any).type === "heading") {
                            return (
                              <div key={(it as any).label} className="mt-2 mb-1 text-[11px] font-semibold text-muted-foreground">
                                {(it as any).label}
                              </div>
                            );
                          }
                          if ((it as any).type === "group") {
                            const label = (it as any).label as string;
                            const isExpanded = expandedGroups.includes(label);
                            return (
                              <>
                                <button
                                  key={label}
                                  className={cn(
                                    "w-full flex items-center justify-between rounded-md px-2 py-1.5 min-h-9 transition-colors",
                                    isExpanded ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                  )}
                                  onClick={() => setExpandedGroups((prev) => prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label])}
                                >
                                  <span>{label}</span>
                                  <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
                                </button>
                                {isExpanded && ((it as any).items as any[]).map((sub) => {
                                  const SubIcon = (sub as any).icon as any;
                                  const active = pathname.startsWith(sub.href);
                                  return (
                                    <Link
                                      key={sub.href}
                                      href={sub.href}
                                      className={cn(
                                        "flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors min-h-9",
                                        active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                      )}
                                      aria-current={active ? "page" : undefined}
                                      onClick={() => setModuleSidebarOpen(false)}
                                    >
                                      <SubIcon className="h-5 w-5" />
                                      {sub.label}
                                    </Link>
                                  );
                                })}
                              </>
                            );
                          }
                          const Icon = (it as any).icon as any;
                          const active = pathname.startsWith(it.href);
                          return (
                            <Link
                              key={it.href}
                              href={it.href}
                              className={cn(
                                "flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors min-h-9",
                                active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                              )}
                              aria-current={active ? "page" : undefined}
                              onClick={() => setModuleSidebarOpen(false)}
                            >
                              <Icon className="h-5 w-5" />
                              {it.label}
                            </Link>
                          );
                        })}
                      </nav>
                    </div>
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
