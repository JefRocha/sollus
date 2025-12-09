"use client";

import React from "react";
import { KpiCard } from "./kpi-card";
import { apiClientFetch } from "@/lib/api-client";

type User = {
  administrador?: string;
  roles?: string[];
};

type FinanceMetrics = {
  contasAPagarPendentes: number;
  contasAReceberPendentes: number;
  saldoCaixa: number;
  movimentosHoje: number;
};

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

export function FinanceSection({ user }: { user?: User }) {
  const [metrics, setMetrics] = React.useState<FinanceMetrics | null>(null);
  const [userClient, setUserClient] = React.useState<User | undefined>(undefined);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const token = typeof window !== "undefined" ? (localStorage.getItem("sollus_access_token") || undefined) : undefined;
        const res = await fetch('/api/me', {
          credentials: 'include',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.ok) {
          const u = await res.json();
          setUserClient({ administrador: u?.administrador, roles: u?.roles });
        }
      } catch { }
    };
    loadUser();
  }, []);

  const isAdmin = React.useMemo(() => {
    const src = userClient || user;
    const adm = String(src?.administrador || "").toUpperCase();
    const roles = Array.isArray(src?.roles) ? src!.roles!.map((r) => String(r).toUpperCase()) : [];
    return adm === "S" || adm === "Y" || adm === "TRUE" || adm === "1" || roles.includes("ADMIN") || roles.includes("ROLE_ADMIN");
  }, [user, userClient]);

  React.useEffect(() => {
    if (!isAdmin) {
      setMetrics(null);
      return;
    }
    const fetchJson = async (path: string) => {
      try {
        const r = await apiClientFetch<any>(path, { method: 'GET' });
        return r;
      } catch { return null; }
    };
    (async () => {
      const pagar = await (async () => {
        for (const p of ["/api/financeiro/pagar/pendentes", "/api/contas/pagar/pendentes"]) {
          const r = await fetchJson(p);
          if (r) return Array.isArray(r) ? r.length : (Array.isArray(r?.data) ? r.data.length : (Array.isArray(r?.content) ? r.content.length : (typeof r?.count === "number" ? r.count : 0)));
        }
        return 0;
      })();
      const receber = await (async () => {
        for (const p of ["/api/financeiro/receber/pendentes", "/api/contas/receber/pendentes"]) {
          const r = await fetchJson(p);
          if (r) return Array.isArray(r) ? r.length : (Array.isArray(r?.data) ? r.data.length : (Array.isArray(r?.content) ? r.content.length : (typeof r?.count === "number" ? r.count : 0)));
        }
        return 0;
      })();
      const saldo = await (async () => {
        for (const p of ["/api/financeiro/saldo/caixa", "/api/caixa/saldo"]) {
          const r = await fetchJson(p);
          if (typeof r === "number") return r;
          if (typeof r?.valor === "number") return r.valor;
          if (typeof r?.total === "number") return r.total;
        }
        return 0;
      })();
      const movimentos = await (async () => {
        for (const p of ["/api/financeiro/movimentos/hoje", "/api/caixa/movimentos/hoje"]) {
          const r = await fetchJson(p);
          if (r) return Array.isArray(r) ? r.length : (Array.isArray(r?.data) ? r.data.length : (Array.isArray(r?.content) ? r.content.length : (typeof r?.count === "number" ? r.count : 0)));
        }
        return 0;
      })();
      setMetrics({ contasAPagarPendentes: pagar, contasAReceberPendentes: receber, saldoCaixa: saldo, movimentosHoje: movimentos });
    })();
  }, [isAdmin]);

  if (!isAdmin || !metrics) return null;
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Financeiro</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="A Pagar Pendentes" value={String(metrics.contasAPagarPendentes)} diff="Contas em aberto" />
        <KpiCard title="A Receber Pendentes" value={String(metrics.contasAReceberPendentes)} diff="Recebíveis em aberto" />
        <KpiCard title="Saldo de Caixa" value={fmtCurrency(metrics.saldoCaixa)} diff="Balanceado" />
        <KpiCard title="Movimentos Hoje" value={String(metrics.movimentosHoje)} diff="Transações de hoje" />
      </div>
    </div>
  );
}
