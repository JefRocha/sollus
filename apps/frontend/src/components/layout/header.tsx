"use client";

import * as React from "react";

import { Menu, LogOut, User, ChevronRight, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { logoutAction } from "@/actions/auth";
import { useAction } from "next-safe-action/hooks";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { apiClientFetch } from "@/lib/api-client";

interface HeaderProps {
  onMenuClick: () => void;
  user?: {
    name?: string;
    email?: string;
    administrador?: string;
    roles?: string[];
    displayName?: string;
  };
}

export function Header({ onMenuClick, user }: HeaderProps) {
  const pathname = usePathname();
  const { execute: executeLogout, isExecuting: isLoggingOut } = useAction(
    logoutAction,
    {
      onSuccess: () => {
        window.location.href = "/login";
      },
      onError: (error) => {
        console.error("Erro ao fazer logout:", error);
        window.location.href = "/login";
      },
    }
  );

  const breadcrumbs = useMemo(() => {
    const paths = pathname.split("/").filter(Boolean);
    return paths.map((path, index) => ({
      label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "),
      href: "/" + paths.slice(0, index + 1).join("/"),
      isLast: index === paths.length - 1,
    }));
  }, [pathname]);

  const handleLogout = async () => {
    await executeLogout();
  };

  const [tone, setTone] = React.useState<string>("primary");
  const [color, setColor] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    try {
      const t = localStorage.getItem("pc:headerTone");
      const c = localStorage.getItem("pc:headerColor");
      if (c) setColor(c);
      else if (t) setTone(t);
    } catch {}
  }, []);

  // Resolve dados do usuário para o dropdown
  const [localUser, setLocalUser] = React.useState(user);
  React.useEffect(() => {
    if (user?.email || user?.displayName || user?.name) {
      setLocalUser(user);
    } else {
      const load = async () => {
        try {
          const u = await apiClientFetch<any>("/api/auth/me");
          const name = u?.name ?? undefined;
          const email = u?.email ?? undefined;
          const displayName =
            u?.displayName ??
            name ??
            (email ? String(email).split("@")[0] : undefined);
          setLocalUser({
            name,
            email,
            displayName,
            administrador: u?.administrador,
            roles: u?.roles,
          });
        } catch (error) {
          console.error("Falha ao buscar dados do usuário:", error);
          try {
            const name = localStorage.getItem("user:name") || undefined;
            const email = localStorage.getItem("user:email") || undefined;
            const displayName =
              localStorage.getItem("user:displayName") || undefined;
            if (name || email || displayName) {
              setLocalUser({ name, email, displayName });
            }
          } catch {}
        }
      };
      load();
    }
  }, [user]);

  const applyToneColor = (newTone?: string, newColor?: string) => {
    try {
      const root = document.documentElement;
      if (newColor) {
        root.style.setProperty("--pc-header-from", newColor);
        const hex = newColor.trim();
        let r = 255,
          g = 255,
          b = 255;
        if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) {
          const h = hex.replace("#", "");
          if (h.length === 3) {
            r = parseInt(h[0] + h[0], 16);
            g = parseInt(h[1] + h[1], 16);
            b = parseInt(h[2] + h[2], 16);
          } else {
            r = parseInt(h.slice(0, 2), 16);
            g = parseInt(h.slice(2, 4), 16);
            b = parseInt(h.slice(4, 6), 16);
          }
        }
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        root.style.setProperty(
          "--pc-header-fg",
          luminance < 186 ? "var(--primary-foreground)" : "var(--foreground)"
        );
        root.style.setProperty(
          "--pc-header-fg-muted",
          `color-mix(in oklch, var(--pc-header-fg) 80%, transparent)`
        );
      } else {
        const tone = newTone || "primary";
        const baseMap: Record<string, string> = {
          primary: "var(--primary)",
          secondary: "var(--secondary)",
          accent: "var(--accent)",
          muted: "var(--muted)",
          none: "transparent",
        };
        root.style.setProperty(
          "--pc-header-from",
          baseMap[tone] || "var(--primary)"
        );
        const map: Record<string, string> = {
          primary: "var(--foreground)",
          secondary: "var(--foreground)",
          accent: "var(--foreground)",
          muted: "var(--foreground)",
          none: "var(--foreground)",
        };
        root.style.setProperty(
          "--pc-header-fg",
          map[tone] || "var(--foreground)"
        );
        root.style.setProperty(
          "--pc-header-fg-muted",
          `color-mix(in oklch, var(--pc-header-fg) 80%, transparent)`
        );
      }
    } catch {}
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b glass shadow-sm"
      style={{
        background: "var(--ui-header-bg)",
        color: "var(--ui-header-fg)",
      }}
    >
      <div className="flex h-16 items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-primary/10 transition-smooth"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Sollus ERP
          </h1>

          {breadcrumbs.length > 0 && (
            <>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.href}>
                      <BreadcrumbItem>
                        {crumb.isLast ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={crumb.href}>
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!crumb.isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Cores do cabeçalho"
              >
                <Palette className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel>Tom do tema</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setTone("primary");
                  setColor(undefined);
                  try {
                    localStorage.setItem("pc:headerTone", "primary");
                    localStorage.removeItem("pc:headerColor");
                  } catch {}
                  try {
                    const root = document.documentElement;
                    root.style.setProperty(
                      "--pc-header-from",
                      `color-mix(in oklch, var(--primary) 20%, transparent)`
                    );
                    root.style.setProperty(
                      "--pc-header-fg",
                      "var(--foreground)"
                    );
                    root.style.setProperty(
                      "--pc-header-fg-muted",
                      `color-mix(in oklch, var(--pc-header-fg) 80%, transparent)`
                    );
                  } catch {}
                  try {
                    const root = document.documentElement;
                    root.style.removeProperty("--ui-header-bg");
                    root.style.removeProperty("--ui-header-fg");
                    root.style.removeProperty("--ui-sidebar-bg");
                    root.style.removeProperty("--ui-sidebar-fg");
                  } catch {}
                  try {
                    window.dispatchEvent(
                      new CustomEvent("pc:headerColorChange", {
                        detail: { tone: "primary", color: undefined },
                      })
                    );
                  } catch {}
                }}
              >
                Padrão do sistema
              </DropdownMenuItem>
              <DropdownMenuRadioGroup
                value={color ? "none" : tone}
                onValueChange={(val) => {
                  setTone(val);
                  setColor(undefined);
                  try {
                    localStorage.setItem("pc:headerTone", val);
                    localStorage.removeItem("pc:headerColor");
                  } catch {}
                  applyToneColor(val, undefined);
                  try {
                    window.dispatchEvent(
                      new CustomEvent("pc:headerColorChange", {
                        detail: { tone: val, color: undefined },
                      })
                    );
                  } catch {}
                }}
              >
                <DropdownMenuRadioItem value="primary">
                  Primário
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="secondary">
                  Secundário
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="accent">
                  Acento
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="muted">
                  Suave
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="none">
                  Sem gradiente
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Cor personalizada</DropdownMenuLabel>
              <div className="flex items-center gap-2 p-2">
                <Input
                  type="color"
                  className="h-8 w-14 p-1"
                  value={color ?? "#ffffff"}
                  onChange={(e) => {
                    const v = e.target.value;
                    setColor(v);
                    try {
                      localStorage.setItem("pc:headerColor", v);
                      localStorage.removeItem("pc:headerTone");
                    } catch {}
                    applyToneColor(undefined, v);
                    try {
                      window.dispatchEvent(
                        new CustomEvent("pc:headerColorChange", {
                          detail: { tone: undefined, color: v },
                        })
                      );
                    } catch {}
                  }}
                />
                <Input
                  type="text"
                  className="h-8 flex-1"
                  placeholder="oklch(...) ou #hex"
                  value={color ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setColor(v);
                    try {
                      localStorage.setItem("pc:headerColor", v);
                      localStorage.removeItem("pc:headerTone");
                    } catch {}
                    applyToneColor(undefined, v);
                    try {
                      window.dispatchEvent(
                        new CustomEvent("pc:headerColorChange", {
                          detail: { tone: undefined, color: v },
                        })
                      );
                    } catch {}
                  }}
                />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Aplicar seleção</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  const toneOrColor = color ? { color } : { tone };
                  try {
                    const root = document.documentElement;
                    const factorMap: Record<string, string> = {
                      primary: "28%",
                      secondary: "26%",
                      accent: "26%",
                      muted: "18%",
                      none: "0%",
                    };
                    const baseMap: Record<string, string> = {
                      primary: "var(--primary)",
                      secondary: "var(--secondary-foreground)",
                      accent: "var(--accent)",
                      muted: "var(--muted-foreground)",
                      none: "transparent",
                    };
                    const bg = color
                      ? `color-mix(in srgb, ${color} 30%, transparent)`
                      : `color-mix(in oklch, ${baseMap[tone]} ${
                          factorMap[tone] || "28%"
                        }, transparent)`;
                    root.style.setProperty("--ui-header-bg", bg);
                    root.style.setProperty(
                      "--ui-header-fg",
                      "var(--foreground)"
                    );
                  } catch {}
                }}
              >
                Aplicar ao cabeçalho
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  try {
                    const root = document.documentElement;
                    const factorMap: Record<string, string> = {
                      primary: "28%",
                      secondary: "26%",
                      accent: "26%",
                      muted: "18%",
                      none: "0%",
                    };
                    const baseMap: Record<string, string> = {
                      primary: "var(--primary)",
                      secondary: "var(--secondary-foreground)",
                      accent: "var(--accent)",
                      muted: "var(--muted-foreground)",
                      none: "transparent",
                    };
                    const bg = color
                      ? `color-mix(in srgb, ${color} 30%, transparent)`
                      : `color-mix(in oklch, ${baseMap[tone]} ${
                          factorMap[tone] || "28%"
                        }, transparent)`;
                    root.style.setProperty("--ui-sidebar-bg", bg);
                    root.style.setProperty(
                      "--ui-sidebar-fg",
                      "var(--foreground)"
                    );
                  } catch {}
                }}
              >
                Aplicar à sidebar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setTone("primary");
                  setColor(undefined);
                  try {
                    localStorage.setItem("pc:headerTone", "primary");
                    localStorage.removeItem("pc:headerColor");
                  } catch {}
                  try {
                    const root = document.documentElement;
                    root.style.setProperty(
                      "--pc-header-from",
                      `color-mix(in oklch, var(--primary) 20%, transparent)`
                    );
                    root.style.setProperty(
                      "--pc-header-fg",
                      "var(--foreground)"
                    );
                    root.style.setProperty(
                      "--pc-header-fg-muted",
                      `color-mix(in oklch, var(--pc-header-fg) 80%, transparent)`
                    );
                  } catch {}
                  try {
                    const root = document.documentElement;
                    root.style.removeProperty("--ui-header-bg");
                    root.style.removeProperty("--ui-header-fg");
                    root.style.removeProperty("--ui-sidebar-bg");
                    root.style.removeProperty("--ui-sidebar-fg");
                  } catch {}
                  try {
                    window.dispatchEvent(
                      new CustomEvent("pc:headerColorChange", {
                        detail: { tone: "primary", color: undefined },
                      })
                    );
                  } catch {}
                }}
              >
                Redefinir padrão
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {(() => {
                      const base =
                        localUser?.displayName ||
                        localUser?.name ||
                        localUser?.email ||
                        "";
                      const parts = String(base)
                        .split(/[\s@._-]+/)
                        .filter(Boolean);
                      const initials =
                        (parts[0]?.[0] || "A") + (parts[1]?.[0] || "D");
                      return initials.toUpperCase();
                    })()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {localUser?.displayName ||
                      localUser?.name ||
                      localUser?.email ||
                      "Usuário"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {localUser?.email ||
                      (Array.isArray(localUser?.roles) &&
                      localUser!.roles!.includes("ADMIN")
                        ? "Administrador"
                        : "")}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
