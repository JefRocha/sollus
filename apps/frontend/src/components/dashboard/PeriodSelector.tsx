"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { type Period } from "@/lib/finance-mock";

export function PeriodSelector({
  value,
  onChange,
  onExport,
}: {
  value: Period;
  onChange: (p: Period) => void;
  onExport?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Tabs value={value} onValueChange={(v) => onChange(v as Period)}>
        <TabsList>
          <TabsTrigger value="semanal">Semanal</TabsTrigger>
          <TabsTrigger value="quinzenal">Quinzenal</TabsTrigger>
          <TabsTrigger value="mensal">Mensal</TabsTrigger>
          <TabsTrigger value="trimestral">Trimestral</TabsTrigger>
          <TabsTrigger value="anual">Anual</TabsTrigger>
        </TabsList>
      </Tabs>
      <Button onClick={onExport} variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Exportar Relatório
      </Button>
    </div>
  );
}
