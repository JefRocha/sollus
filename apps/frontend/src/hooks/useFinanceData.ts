"use client";

import { useEffect, useMemo, useState } from "react";
import {
  generateFinanceData,
  type FinanceMockData,
  type Period,
} from "@/lib/finance-mock";

export function useFinanceData(initialPeriod: Period = "mensal") {
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [data, setData] = useState<FinanceMockData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setData(generateFinanceData(period));
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [period]);

  const kpis = useMemo(() => {
    if (!data) return null;
    return {
      faturamentoTotal: data.faturamentoTotal,
      contasReceber: data.contasReceber,
      contasPagar: data.contasPagar,
      saldoCaixa: data.saldoCaixa,
      lucroLiquido: data.lucroLiquido,
      despesasCategoria: data.despesasCategoria,
      receitaPorPagamento: data.receitaPorPagamento,
      inadimplencia: data.inadimplencia,
      ticketMedio: data.ticketMedio,
      projecaoReceita: data.projecaoReceita,
      topClientes: data.topClientes,
      ultimasMovimentacoes: data.ultimasMovimentacoes,
    };
  }, [data]);

  return { period, setPeriod, data, kpis, loading };
}
