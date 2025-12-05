"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Row {
  id: string;
  cliente: string;
  valor: string;
  status: string;
}

const rows: Row[] = [
  { id: "#1001", cliente: "ACME Ltda", valor: "R$ 1.250,00", status: "Pago" },
  { id: "#1002", cliente: "Beta Corp", valor: "R$ 980,00", status: "Pendente" },
  { id: "#1003", cliente: "Gamma SA", valor: "R$ 2.430,00", status: "Pago" },
  { id: "#1004", cliente: "Delta ME", valor: "R$ 750,00", status: "Cancelado" },
];

export function RecentTable() {
  return (
    <Card className="border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left py-2 pr-4">ID</th>
                <th className="text-left py-2 pr-4">Cliente</th>
                <th className="text-left py-2 pr-4">Valor</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-2 pr-4">{r.id}</td>
                  <td className="py-2 pr-4">{r.cliente}</td>
                  <td className="py-2 pr-4">{r.valor}</td>
                  <td className="py-2">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] bg-muted text-muted-foreground">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

