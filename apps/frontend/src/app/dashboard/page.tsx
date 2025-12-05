import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { KpiCard } from "./_components/kpi-card";
import { OverviewChart } from "./_components/overview-chart";
import { ChartSwitcher } from "./_components/chart-switcher";
import { RecentTable } from "./_components/recent-table";
import { LayoutDashboard, Users, Package, ShoppingCart } from "lucide-react";
import {
  getDashboardMetrics,
  getCurrentUser,
  getFinanceMetrics,
} from "./dashboard.service";

export default async function DashboardPage() {
  const [metrics, user] = await Promise.all([
    getDashboardMetrics(),
    getCurrentUser(),
  ]);
  const isAdmin = !!(
    user?.administrador === "S" ||
    (Array.isArray(user?.roles) && user.roles.includes("ADMIN"))
  );
  const finance = isAdmin ? await getFinanceMetrics() : undefined;
  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(n);
  return (
    <DashboardLayout user={user || undefined}>
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo ao Sollus ERP</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total de Vendas"
            value={fmtCurrency(metrics.totalVendas)}
            diff="Mês corrente"
            icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiCard
            title="Clientes"
            value={String(metrics.clientes)}
            diff="Total cadastrados"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiCard
            title="Produtos"
            value={String(metrics.produtos)}
            diff="Total ativos"
            icon={<Package className="h-4 w-4 text-muted-foreground" />}
          />
          <KpiCard
            title="Pedidos Pendentes"
            value={String(metrics.pedidosPendentes)}
            diff="Aguardando processamento"
            icon={<LayoutDashboard className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <OverviewChart series={metrics.vendasMensais} />
          </div>
          <RecentTable />
        </div>

        <ChartSwitcher title="Outros Gráficos" series={metrics.vendasMensais} />

        {isAdmin && finance && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Financeiro</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <KpiCard
                title="A Pagar Pendentes"
                value={String(finance.contasAPagarPendentes)}
                diff="Contas em aberto"
              />
              <KpiCard
                title="A Receber Pendentes"
                value={String(finance.contasAReceberPendentes)}
                diff="Recebíveis em aberto"
              />
              <KpiCard
                title="Saldo de Caixa"
                value={fmtCurrency(finance.saldoCaixa)}
                diff="Balanceado"
              />
              <KpiCard
                title="Movimentos Hoje"
                value={String(finance.movimentosHoje)}
                diff="Transações de hoje"
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
