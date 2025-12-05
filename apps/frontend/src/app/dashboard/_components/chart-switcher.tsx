"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import * as React from "react";

type ChartRenderer = (props: { data: number[]; labels?: string[] }) => React.ReactElement | null;

interface ChartSwitcherProps {
  title?: string;
  series: number[];
  labels?: string[];
}

export function ChartSwitcher({ title = "Gráficos", series, labels }: ChartSwitcherProps) {
  const [line, setLine] = useState<ChartRenderer | null>(null);
  const [bar, setBar] = useState<ChartRenderer | null>(null);
  const [area, setArea] = useState<ChartRenderer | null>(null);
  const [pie, setPie] = useState<ChartRenderer | null>(null);

  useEffect(() => {
    const candidates = {
      line: [() => import("@/components/charts/line-chart").then((m: any) => m.default || m.LineChart)],
      bar: [() => import("@/components/charts/bar-chart").then((m: any) => m.default || m.BarChart)],
      area: [() => import("@/components/charts/area-chart").then((m: any) => m.default || m.AreaChart)],
      pie: [() => import("@/components/charts/pie-chart").then((m: any) => m.default || m.PieChart)],
    } as const;
    const loadOne = async (arr: ReadonlyArray<() => Promise<any>>) => {
      for (const l of arr) {
        try {
          const C = await l();
          if (C) return ((props: { data: number[]; labels?: string[] }) => <C {...props} />) as ChartRenderer;
        } catch {}
      }
      return null;
    };
    loadOne(candidates.line).then((r) => r && setLine(() => r));
    loadOne(candidates.bar).then((r) => r && setBar(() => r));
    loadOne(candidates.area).then((r) => r && setArea(() => r));
    loadOne(candidates.pie).then((r) => r && setPie(() => r));
  }, []);

  const FallbackLine = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const pts = data.map((v, i) => `${i * 30},${120 - Math.round((v / max) * 100)}`).join(" ");
    return (
      <svg viewBox="0 0 360 120" className="h-36 w-full">
        <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
      </svg>
    );
  };
  const FallbackBar = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    return (
      <svg viewBox="0 0 360 120" className="h-36 w-full">
        {data.map((v, i) => (
          <rect key={i} x={i * 30 + 4} y={120 - Math.round((v / max) * 100)} width={22} height={Math.round((v / max) * 100)} className="fill-primary" />
        ))}
      </svg>
    );
  };
  const FallbackArea = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const pts = data.map((v, i) => `${i * 30},${120 - Math.round((v / max) * 100)}`).join(" ");
    return (
      <svg viewBox="0 0 360 120" className="h-36 w-full">
        <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
        <polygon points={`0,120 ${pts} 330,120`} className="fill-primary/20" />
      </svg>
    );
  };
  const FallbackPie = ({ data }: { data: number[] }) => {
    const total = data.reduce((a, b) => a + (Number(b) || 0), 0) || 1;
    let acc = 0;
    const colors = ["text-primary", "text-accent", "text-secondary", "text-muted-foreground"];
    return (
      <svg viewBox="0 0 120 120" className="h-36 w-36">
        {data.map((v, i) => {
          const start = (acc / total) * Math.PI * 2;
          acc += Number(v) || 0;
          const end = (acc / total) * Math.PI * 2;
          const x1 = 60 + 50 * Math.cos(start);
          const y1 = 60 + 50 * Math.sin(start);
          const x2 = 60 + 50 * Math.cos(end);
          const y2 = 60 + 50 * Math.sin(end);
          const large = end - start > Math.PI ? 1 : 0;
          return (
            <path key={i} d={`M60,60 L ${x1},${y1} A 50,50 0 ${large} 1 ${x2},${y2} Z`} className={`${colors[i % colors.length]} fill-current`} />
          );
        })}
      </svg>
    );
  };

  return (
    <Card className="border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={line ? "linha" : bar ? "barras" : area ? "area" : "pizza"}>
          <TabsList>
            <TabsTrigger value="linha">Linha</TabsTrigger>
            <TabsTrigger value="barras">Barras</TabsTrigger>
            <TabsTrigger value="area">Área</TabsTrigger>
            <TabsTrigger value="pizza">Pizza</TabsTrigger>
          </TabsList>
          <TabsContent value="linha" className="mt-3">
            {line ? <>{line({ data: series, labels })}</> : <FallbackLine data={series} />}
          </TabsContent>
          <TabsContent value="barras" className="mt-3">
            {bar ? <>{bar({ data: series, labels })}</> : <FallbackBar data={series} />}
          </TabsContent>
          <TabsContent value="area" className="mt-3">
            {area ? <>{area({ data: series, labels })}</> : <FallbackArea data={series} />}
          </TabsContent>
          <TabsContent value="pizza" className="mt-3">
            {pie ? <>{pie({ data: series, labels })}</> : <FallbackPie data={series} />}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
