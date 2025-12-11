"use client";

import * as React from "react";

import {
  Menu,
  LogOut,
  User,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
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
import { ThemeTransparencyControl } from "@/components/theme-transparency";
import { RentHubSoftnessControl } from "@/components/renthub-softness-control";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn, formatUserName } from "@/lib/utils";
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
  showMenuButton?: boolean;
  user?: {
    name?: string;
    email?: string;
    administrador?: string;
    roles?: string[];
    displayName?: string;
  };
}

export function Header({
  onMenuClick,
  user,
  showMenuButton = true,
}: HeaderProps) {
  const pathname = usePathname();
  const { execute: executeLogout, isExecuting: isLoggingOut } = useAction(
    logoutAction,
    {
      onSuccess: () => {
        // Limpar tokens do localStorage
        try {
          localStorage.removeItem("sollus_access_token");
          localStorage.removeItem("sollus_refresh_token");
        } catch {}
        window.location.href = "/login";
      },
      onError: (error) => {
        console.error("Erro ao fazer logout:", error);
        // Mesmo com erro, limpar tokens e redirecionar
        try {
          localStorage.removeItem("sollus_access_token");
          localStorage.removeItem("sollus_refresh_token");
        } catch {}
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
    // Limpar tokens ANTES de fazer logout para evitar requisições com token inválido
    try {
      localStorage.removeItem("sollus_access_token");
      localStorage.removeItem("sollus_refresh_token");
    } catch {}
    await executeLogout();
  };

  const [tone, setTone] = React.useState<string>("primary");
  const [color, setColor] = React.useState<string | undefined>(undefined);
  const [mounted, setMounted] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  React.useEffect(() => {
    setMounted(true);
    try {
      const t = localStorage.getItem("pc:headerTone");
      const c = localStorage.getItem("pc:headerColor");
      if (c) setColor(c);
      else if (t) setTone(t);
    } catch {}
  }, []);

  React.useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    onFsChange();
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {}
  };

  // Resolve dados do usuário para o dropdown
  const [localUser, setLocalUser] = React.useState(user);
  React.useEffect(() => {
    if (user?.email || user?.displayName || user?.name) {
      setLocalUser(user);
    } else {
      const load = async () => {
        try {
          const u = await apiClientFetch<any>("/api/me");
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
      <div className="flex h-30 items-center px-6 lg:px-6 gap-4">
        <div className="flex items-center gap-1">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden bg-transparent hover:bg-transparent hover:text-primary transition-smooth"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent truncate">
            Sollus ERP
          </h1>
          <nav className="hidden md:flex items-center gap-7 mt-3 md:mt-5">
            {[
              { label: "Início", href: "/dashboard" },
              { label: "Módulos", href: "/cadastros" },
              { label: "Suporte", href: "/suporte" },
              { label: "Configurações", href: "/configuracoes" },
              { label: "Sobre", href: "/sobre" },
            ].map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-base md:text-lg pb-1 border-b-2 transition-colors",
                    active
                      ? "text-foreground border-primary font-semibold"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {mounted && (
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-base md:text-lg font-semibold">
                {formatUserName(
                  localUser?.displayName || localUser?.name || localUser?.email
                ) || "Usuário"}
              </span>
              <span className="text-xs text-muted-foreground">
                {Array.isArray(localUser?.roles) &&
                localUser?.roles?.includes("ADMIN")
                  ? "Administrador"
                  : ""}
              </span>
            </div>
          )}
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full bg-transparent hover:bg-transparent"
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
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {formatUserName(
                        localUser?.displayName ||
                          localUser?.name ||
                          localUser?.email
                      ) || "Usuário"}
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
                <DropdownMenuLabel>Layout do sistema</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={theme || "system"}
                  onValueChange={(v) => setTheme(v)}
                >
                  <DropdownMenuRadioItem value="light">
                    Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    Dark
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="renthub">
                    RentHub
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">
                    System
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <ThemeTransparencyControl />
                <RentHubSoftnessControl />
                <div className="px-3 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? "Sair de tela cheia" : "Tela cheia"}
                  </Button>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
