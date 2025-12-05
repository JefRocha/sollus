"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import * as React from "react";

interface OverviewChartProps {
  title?: string;
  series?: number[];
}

export function OverviewChart({ title = "Visão Geral", series = [12, 18, 16, 22, 19, 24, 28, 26, 30, 27, 32, 35] }: OverviewChartProps) {
  const [ChartComp, setChartComp] = useState<null | ((props: { data: number[] }) => React.ReactElement | null)>(null);

  useEffect(() => {
    const tryImports = async () => {
      try {
        const C = await import("@/components/charts/line-chart").then((m: any) => m.default || m.LineChart);
        if (C) setChartComp(() => (props: { data: number[] }) => <C data={props.data} />);
      } catch {}
    };
    tryImports();
  }, []);

  const points = series;
  const max = Math.max(...points);
  const poly = points.map((v, i) => `${i * 30},${120 - Math.round((v / max) * 100)}`).join(" ");

  return (
    <Card className="border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mensal">
          <TabsList>
            <TabsTrigger value="diario">Diário</TabsTrigger>
            <TabsTrigger value="semanal">Semanal</TabsTrigger>
            <TabsTrigger value="mensal">Mensal</TabsTrigger>
          </TabsList>
          <TabsContent value="mensal" className="mt-3">
            {ChartComp ? (
              <ChartComp data={series} />
            ) : (
              <div className="relative h-36 w-full">
                <svg viewBox="0 0 360 120" className="h-full w-full">
                  <polyline points={poly} fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                </svg>
              </div>
            )}
          </TabsContent>
          <TabsContent value="diario" className="mt-3">
            <div className="text-xs text-muted-foreground">Sem dados</div>
          </TabsContent>
          <TabsContent value="semanal" className="mt-3">
            <div className="text-xs text-muted-foreground">Sem dados</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
