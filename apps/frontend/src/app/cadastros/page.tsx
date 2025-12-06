import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, Activity, Banknote, UserSquare2, ShoppingBag, ShoppingCart, Boxes } from "lucide-react";

export default function Page() {
  const items = [
    { label: "Cadastros", href: "/cadastros/pessoa", icon: Users, desc: "Pessoas, produtos e mais" },
    { label: "Movimento", href: "/dashboard", icon: Activity, desc: "Fluxos e operações" },
    { label: "Financeiro", href: "/financeiro", icon: Banknote, desc: "Contas e recebíveis" },
    { label: "CRM", href: "/crm", icon: UserSquare2, desc: "Relacionamento com clientes" },
    { label: "Compras", href: "/compras", icon: ShoppingBag, desc: "Pedidos de compra" },
    { label: "Vendas", href: "/vendas", icon: ShoppingCart, desc: "Pedidos e faturamento" },
    { label: "Estoque", href: "/estoque", icon: Boxes, desc: "Movimentações e saldos" },
  ];

  return (
    <div className="px-6 py-8">
        <h1 className="text-2xl font-semibold">Módulos</h1>
        <p className="text-muted-foreground mb-6">Escolha um módulo para acessar.</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, idx) => {
            const Icon = it.icon;
            return (
              <Link key={it.label} href={it.href} className="group">
                <Card className={idx === 0 ? "ring-1 ring-primary/30" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      {it.label}
                    </CardTitle>
                    <CardDescription>{it.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">Acesse funcionalidades do módulo {it.label}.</div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
  );
}
