"use client";

import { useFinanceData } from "@/hooks/useFinanceData";
import { PeriodSelector } from "./PeriodSelector";
import { KPICard } from "./KPICard";
import RevenueLineChart from "./RevenueLineChart";
import ExpensesPieChart from "./ExpensesPieChart";
import CashFlowBarChart from "./CashFlowBarChart";
import ProfitAreaChart from "./ProfitAreaChart";
import ProjectionChart from "./ProjectionChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FinanceDashboard() {
  const { period, setPeriod, kpis, loading } = useFinanceData("mensal");

  if (!kpis) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Dashboard Financeiro</h1>
          <div className="w-64"><Skeleton className="h-9 w-full" /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard Financeiro</h1>
        <PeriodSelector value={period} onChange={setPeriod} onExport={() => {}} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Faturamento Total" value={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(kpis.faturamentoTotal.total)} diff={`${kpis.faturamentoTotal.variacao.toFixed(1)}%`}>
          <div className="w-48"><RevenueLineChart data={kpis.faturamentoTotal.series} /></div>
        </KPICard>
        <KPICard title="Contas a Receber" value={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(kpis.contasReceber.total)}>
          <div className="w-48"><CashFlowBarChart data={kpis.contasReceber.porVencimento.map((d) => d.value)} /></div>
        </KPICard>
        <KPICard title="Contas a Pagar" value={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(kpis.contasPagar.total)}>
          <div className="w-48"><CashFlowBarChart data={kpis.contasPagar.porCategoria.map((d) => d.value)} /></div>
        </KPICard>
        <KPICard title="Saldo de Caixa" value={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(kpis.saldoCaixa.total)}>
          <div className="w-48"><RevenueLineChart data={kpis.saldoCaixa.series} /></div>
        </KPICard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Lucro Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfitAreaChart receita={kpis.lucroLiquido.series.receita} despesas={kpis.lucroLiquido.series.despesas} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensesPieChart data={kpis.despesasCategoria} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Receita por Forma de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensesPieChart data={kpis.receitaPorPagamento} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inadimplência</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueLineChart data={kpis.inadimplencia.series} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueLineChart data={kpis.ticketMedio.series} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Projeção de Receita 30/60/90</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectionChart data={kpis.projecaoReceita} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Clientes por Faturamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {kpis.topClientes.map((c) => (
                <div key={c.nome} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-muted-foreground">{c.nome}</div>
                  <div className="flex-1 bg-muted h-2">
                    <div className="bg-primary h-2" style={{ width: `${Math.min(100, (c.valor / kpis.topClientes[0].valor) * 100)}%` }} />
                  </div>
                  <div className="w-32 text-right text-sm">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(c.valor)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimas Movimentações Financeiras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="text-left px-2 py-1">Data</th>
                  <th className="text-left px-2 py-1">Descrição</th>
                  <th className="text-left px-2 py-1">Tipo</th>
                  <th className="text-right px-2 py-1">Valor</th>
                  <th className="text-left px-2 py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {kpis.ultimasMovimentacoes.map((m, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-2 py-1">{m.data}</td>
                    <td className="px-2 py-1">{m.descricao}</td>
                    <td className="px-2 py-1">{m.tipo}</td>
                    <td className="px-2 py-1 text-right">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(m.valor)}</td>
                    <td className="px-2 py-1">{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
