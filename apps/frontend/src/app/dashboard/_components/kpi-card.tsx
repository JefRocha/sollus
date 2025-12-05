"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  diff?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function KpiCard({ title, value, diff, icon, className }: KpiCardProps) {
  return (
    <Card className={cn("border bg-card", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{title}</span>
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {diff && <div className="mt-1 text-xs text-muted-foreground">{diff}</div>}
      </CardContent>
    </Card>
  );
}

