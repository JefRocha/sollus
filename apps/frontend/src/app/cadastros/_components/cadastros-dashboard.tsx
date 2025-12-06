"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartSwitcher } from "@/app/dashboard/_components/chart-switcher";
import { OverviewChart } from "@/app/dashboard/_components/overview-chart";
import { Users, Boxes, UserCog, HandshakeIcon, Banknote } from "lucide-react";

export default function CadastrosDashboard() {
  const seriesA = [12, 18, 16, 22, 19, 24, 28, 26, 30, 27, 32, 35];
  const seriesB = [6, 8, 11, 10, 14, 12, 16, 20, 18, 22, 24, 28];
  const seriesC = [3, 5, 4, 7, 6, 9, 8, 11, 10, 12, 13, 15];

  return (
    <div className="px-6 py-6 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4" /> Pessoas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">1.234</div>
            <div className="text-xs text-muted-foreground">+18% nos últimos 30 dias</div>
          </CardContent>
        </Card>
        <Card className="border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground"><Boxes className="h-4 w-4" /> Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">567</div>
            <div className="text-xs text-muted-foreground">+6% nos últimos 30 dias</div>
          </CardContent>
        </Card>
        <Card className="border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground"><UserCog className="h-4 w-4" /> Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">42</div>
            <div className="text-xs text-muted-foreground">+2 novos nesta semana</div>
          </CardContent>
        </Card>
        <Card className="border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground"><HandshakeIcon className="h-4 w-4" /> Fornecedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">128</div>
            <div className="text-xs text-muted-foreground">+3 cadastrados hoje</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartSwitcher title="Novos Cadastros (mês)" series={seriesA} labels={["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]} />
        <OverviewChart title="Evolução de Pessoas" series={seriesB} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground"><Banknote className="h-4 w-4" /> Bancos cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">85</div>
            <div className="text-xs text-muted-foreground">Lista oficial Febraban</div>
          </CardContent>
        </Card>
        <OverviewChart title="Evolução de Produtos" series={seriesC} />
        <ChartSwitcher title="Distribuição por tipo (pizza)" series={[24,32,18,26]} />
      </div>
    </div>
  );
}
