"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, isMaster } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Settings,
  FileText,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Cadastros",
    icon: Users,
    items: [
      { title: "Pessoas", href: "/cadastros/pessoa" },
      { title: "Produtos", href: "/cadastros/produto" },
      { title: "Colaboradores", href: "/cadastros/colaborador" },
      {
        title: "Outros Cadastros",
        items: [
          { title: "Bancos", href: "/cadastros/bancos" },
          { title: "Cargo", href: "/cadastros/cargo" },
          { title: "CBO", href: "/cadastros/cbo" },
          { title: "Setor", href: "/cadastros/setor" },
          {
            title: "Diversos",
            masterOnly: true,
            items: [
              { title: "Nível de Formação", href: "/cadastros/nivel-formacao" },
              { title: "Estado Civil", href: "/cadastros/estado-civil" },
              { title: "Tabela de Preços", href: "/cadastros/tabela-preco" },
              { title: "Municípios", href: "/cadastros/municipio" },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Vendas",
    href: "/vendas",
    icon: ShoppingCart,
  },
  {
    title: "Estoque",
    href: "/estoque",
    icon: Package,
  },
  {
    title: "Financeiro",
    href: "/financeiro",
    icon: DollarSign,
  },
  {
    title: "Relatórios",
    href: "/relatorios",
    icon: FileText,
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  onNavigate?: () => void;
  onExpand?: () => void;
}

export function Sidebar({
  className,
  collapsed = false,
  onNavigate,
  onExpand,
}: SidebarProps) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Global tables that should only be visible to master users
  const globalTables = [
    "/cadastros/municipio",
    "/cadastros/estado-civil",
    "/cadastros/tipo-admissao",
  ];

  const filterMenuItemsByMaster = (item: any): any | null => {
    // If item is marked as masterOnly, hide it for non-master users
    if (item.masterOnly && !isMaster()) {
      return null;
    }

    // If item has href and it's a global table, check master status
    if (item.href && globalTables.includes(item.href) && !isMaster()) {
      return null;
    }

    // If item has subitems, filter them recursively
    if (item.items) {
      const filteredItems = item.items
        .map((subItem: any) => filterMenuItemsByMaster(subItem))
        .filter((subItem: any) => subItem !== null);

      // If all subitems were filtered out, hide the parent too
      if (filteredItems.length === 0) {
        return null;
      }

      return { ...item, items: filteredItems };
    }

    return item;
  };

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const renderSubItem = (subItem: any, subIndex: number): JSX.Element => {
    if (subItem.items) {
      // Submenu aninhado (recursivo)
      const isExpanded = expandedMenus.includes(subItem.title);
      return (
        <div key={subIndex} className="space-y-1">
          <button
            onClick={() => toggleMenu(subItem.title)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          >
            <span>{subItem.title}</span>
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-90"
              )}
            />
          </button>
          {isExpanded && (
            <div className="ml-4 space-y-1">
              {subItem.items.map((item: any, idx: number) =>
                renderSubItem(item, idx)
              )}
            </div>
          )}
        </div>
      );
    }

    // Link simples
    return (
      <Link
        key={subIndex}
        href={subItem.href}
        className={cn(
          "block px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
          pathname === subItem.href
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground"
        )}
        onClick={(e) => {
          if (collapsed && onExpand) {
            e.preventDefault();
            onExpand();
            return;
          }
          onNavigate?.();
        }}
      >
        {subItem.title}
      </Link>
    );
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 space-y-4 py-4 overflow-y-auto">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              // Filter menu items based on master status
              const filteredItem = filterMenuItemsByMaster(item);
              if (!filteredItem) return null;

              if (filteredItem.items) {
                // Item com subitens (agora colapsável)
                const isExpanded = expandedMenus.includes(item.title);

                // Se collapsed, não mostrar submenus, apenas ícone
                if (collapsed) {
                  return (
                    <button
                      key={index}
                      className={cn(
                        "flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                      )}
                      title={item.title}
                      onClick={() => {
                        onExpand?.();
                        toggleMenu(item.title);
                      }}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                    </button>
                  );
                }

                return (
                  <div key={index} className="space-y-1">
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                        isExpanded
                          ? "text-accent-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.title}
                      </div>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isExpanded && "rotate-90"
                        )}
                      />
                    </button>

                    {isExpanded && (
                      <div className="ml-6 space-y-1">
                        {filteredItem.items.map(
                          (subItem: any, subIndex: number) =>
                            renderSubItem(subItem, subIndex)
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              // Item sem subitens (link direto)
              return (
                <Link
                  key={index}
                  href={item.href!}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? item.title : undefined}
                  onClick={(e) => {
                    if (collapsed && onExpand) {
                      e.preventDefault();
                      onExpand();
                      return;
                    }
                    onNavigate?.();
                  }}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {!collapsed && item.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div className="p-4 border-t space-y-2" />
    </div>
  );
}
