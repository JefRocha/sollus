"use client";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "./layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";

interface PageContainerProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  contentClassName?: string;
  headerTone?: "primary" | "secondary" | "accent" | "muted" | "none";
  headerColor?: string;
  children: ReactNode;
}

export function PageContainer({
  title,
  description,
  actions,
  breadcrumbs,
  contentClassName,
  headerTone = "primary",
  headerColor,
  children,
}: PageContainerProps) {
  const [tone, setTone] = useState<string>(headerTone);
  const [color, setColor] = useState<string | undefined>(headerColor);
  useEffect(() => {
    try {
      const t = localStorage.getItem("pc:headerTone");
      const c = localStorage.getItem("pc:headerColor");
      if (c) setColor(c);
      else if (t) setTone(t);
      const root = document.documentElement;
      if (c) root.style.setProperty("--pc-header-from", c);
      else {
        const toneSel = t || "primary";
        if (toneSel === "primary") {
          root.style.setProperty(
            "--pc-header-from",
            `color-mix(in oklch, var(--primary) 20%, transparent)`
          );
        } else {
          const baseMap: Record<string, string> = {
            secondary: "var(--secondary-foreground)",
            accent: "var(--accent-foreground)",
            muted: "var(--muted-foreground)",
            none: "transparent",
          };
          root.style.setProperty(
            "--pc-header-from",
            baseMap[toneSel] || "var(--primary)"
          );
        }
      }
      if (c) {
        const hex = c.trim();
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
      } else {
        const toneVar = t || "primary";
        const map: Record<string, string> = {
          primary: "var(--foreground)",
          secondary: "var(--foreground)",
          accent: "var(--foreground)",
          muted: "var(--foreground)",
          none: "var(--foreground)",
        };
        root.style.setProperty(
          "--pc-header-fg",
          map[toneVar] || "var(--foreground)"
        );
      }
      root.style.setProperty(
        "--pc-header-fg-muted",
        `color-mix(in oklch, var(--pc-header-fg) 80%, transparent)`
      );
    } catch {}
  }, []);
  useEffect(() => {
    const onCustom = (e: any) => {
      const d = e.detail || {};
      if (typeof d.color !== "undefined") setColor(d.color);
      if (typeof d.tone !== "undefined") setTone(d.tone);
      try {
        const root = document.documentElement;
        if (typeof d.color !== "undefined" && d.color) {
          root.style.setProperty("--pc-header-from", d.color);
          const hex = d.color.trim();
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
        } else if (typeof d.tone !== "undefined") {
          root.style.setProperty(
            "--pc-header-from",
            (() => {
              const tone = d.tone || "primary";
              const baseMap: Record<string, string> = {
                primary: "var(--primary)",
                secondary: "var(--secondary-foreground)",
                accent: "var(--accent-foreground)",
                muted: "var(--muted-foreground)",
                none: "transparent",
              };
              return baseMap[tone] || "var(--primary)";
            })()
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
            map[d.tone || "primary"] || "var(--foreground)"
          );
          if ((d.tone || "primary") === "primary") {
            root.style.setProperty(
              "--pc-header-from",
              `color-mix(in oklch, var(--primary) 20%, transparent)`
            );
          }
          root.style.setProperty(
            "--pc-header-fg-muted",
            `color-mix(in oklch, var(--pc-header-fg) 80%, transparent)`
          );
        }
      } catch {}
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === "pc:headerColor") setColor(e.newValue || undefined);
      if (e.key === "pc:headerTone") setTone(e.newValue || "primary");
      try {
        const root = document.documentElement;
        if (e.key === "pc:headerColor" && e.newValue) {
          root.style.setProperty("--pc-header-from", e.newValue);
          const hex = e.newValue.trim();
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
        } else if (e.key === "pc:headerTone" && e.newValue) {
          root.style.setProperty(
            "--pc-header-from",
            (() => {
              const tone = e.newValue;
              const baseMap: Record<string, string> = {
                primary: "var(--primary)",
                secondary: "var(--secondary-foreground)",
                accent: "var(--accent-foreground)",
                muted: "var(--muted-foreground)",
                none: "transparent",
              };
              return baseMap[tone] || "var(--primary)";
            })()
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
            map[e.newValue] || "var(--foreground)"
          );
          if (e.newValue === "primary") {
            root.style.setProperty(
              "--pc-header-from",
              `color-mix(in oklch, var(--primary) 20%, transparent)`
            );
          }
          root.style.setProperty(
            "--pc-header-fg-muted",
            `color-mix(in oklch, var(--pc-header-fg) 80%, transparent)`
          );
        }
      } catch {}
    };
    window.addEventListener("pc:headerColorChange", onCustom as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(
        "pc:headerColorChange",
        onCustom as EventListener
      );
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  const headerGradientClass = cn(
    "bg-gradient-to-br from-[var(--pc-header-from)] to-transparent"
  );
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
        <Card className="flex-1 flex flex-col gap-0 overflow-hidden shadow-xl border-border/40 py-4">
          {(title || actions) && (
            <CardHeader
              className={cn(
                "flex items-center min-h-0 px-6 py-2 shrink-0",
                headerGradientClass
              )}
            >
              <div className="space-y-1">
                {title && (
                  <CardTitle>
                    <h1 className="text-3xl font-bold text-[var(--pc-header-fg)]">
                      {title}
                    </h1>
                  </CardTitle>
                )}
                {description && (
                  <CardDescription className="text-base text-[var(--pc-header-fg-muted)]">
                    {description}
                  </CardDescription>
                )}
              </div>
              <CardAction>{actions}</CardAction>
            </CardHeader>
          )}
          <CardContent
            className={cn(
              "flex-1 pt-3 px-6 pb-4 overflow-auto flex flex-col",
              contentClassName
            )}
          >
            {children}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
