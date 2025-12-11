export type Period =
  | "semanal"
  | "quinzenal"
  | "mensal"
  | "trimestral"
  | "anual";

export type FinanceMockData = {
  faturamentoTotal: { total: number; variacao: number; series: number[] };
  contasReceber: {
    total: number;
    porVencimento: Array<{ label: string; value: number }>;
  };
  contasPagar: {
    total: number;
    porCategoria: Array<{ label: string; value: number }>;
  };
  saldoCaixa: { total: number; series: number[] };
  lucroLiquido: {
    total: number;
    series: { receita: number[]; despesas: number[] };
  };
  despesasCategoria: Array<{ label: string; value: number }>;
  receitaPorPagamento: Array<{ label: string; value: number }>;
  inadimplencia: { percentual: number; series: number[] };
  ticketMedio: { valor: number; series: number[] };
  projecaoReceita: { dias30: number[]; dias60: number[]; dias90: number[] };
  topClientes: Array<{ nome: string; valor: number }>;
  ultimasMovimentacoes: Array<{
    data: string;
    descricao: string;
    tipo: "Entrada" | "Saída";
    valor: number;
    status: string;
  }>;
};

const rnd = (min: number, max: number) =>
  Math.round(min + Math.random() * (max - min));

const makeSeries = (points: number, base: number, vol: number) =>
  Array.from({ length: points }).map(() => Math.max(0, base + rnd(-vol, vol)));

const periodPoints = (period: Period) =>
  ({
    semanal: 7,
    quinzenal: 15,
    mensal: 30,
    trimestral: 12,
    anual: 12,
  }[period]);

export function generateFinanceData(
  period: Period,
  seed?: number
): FinanceMockData {
  const points = periodPoints(period);
  const receitaSeries = makeSeries(points, 18000, 6000);
  const despesaSeries = makeSeries(points, 9000, 4000);
  const faturamentoTotal = receitaSeries.reduce((a, b) => a + b, 0);
  const faturamentoPrev = faturamentoTotal * (0.9 + Math.random() * 0.2);
  const variacao =
    ((faturamentoTotal - faturamentoPrev) / Math.max(1, faturamentoPrev)) * 100;
  const saldoSeries = makeSeries(points, 25000, 8000);
  const lucroTotal =
    receitaSeries.reduce((a, b) => a + b, 0) -
    despesaSeries.reduce((a, b) => a + b, 0);

  const contasReceberTotal = rnd(60000, 120000);
  const contasPagarTotal = rnd(40000, 90000);

  const porVencimento = [
    "Vence hoje",
    "7 dias",
    "15 dias",
    "30 dias",
    "> 30 dias",
  ].map((l) => ({ label: l, value: rnd(4000, 18000) }));
  const categorias = [
    "Fornecedores",
    "Impostos",
    "Folha",
    "Serviços",
    "Infra",
    "Marketing",
  ];
  const porCategoria = categorias.map((c) => ({
    label: c,
    value: rnd(3000, 16000),
  }));

  const despesasCategoria = categorias.map((c) => ({
    label: c,
    value: rnd(5000, 18000),
  }));
  const receitaPorPagamento = ["Pix", "Cartão", "Dinheiro", "Boleto"].map(
    (m) => ({ label: m, value: rnd(10000, 40000) })
  );

  const inadSeries = makeSeries(points, 6, 3);
  const inadPercentual = Math.min(
    25,
    Math.max(2, inadSeries[inadSeries.length - 1])
  );
  const ticketSeries = makeSeries(points, 540, 140);
  const ticketMedioValor = ticketSeries[ticketSeries.length - 1];

  const projecaoReceita = {
    dias30: makeSeries(6, 20000, 5000),
    dias60: makeSeries(6, 22000, 6000),
    dias90: makeSeries(6, 24000, 7000),
  };

  const clientes = [
    "Omega SA",
    "Atlas LTDA",
    "Nexus Comércio",
    "Prime Tech",
    "Horizonte Ind.",
    "Delta Serviços",
    "Aurora",
  ];
  const topClientes = clientes
    .slice(0, 5)
    .map((n) => ({ nome: n, valor: rnd(20000, 90000) }))
    .sort((a, b) => b.valor - a.valor);

  const statusPool = ["Pago", "Pendente", "Processando", "Falhou"];
  const ultimasMovimentacoes = Array.from({ length: 12 }).map(() => ({
    data: new Date(Date.now() - rnd(0, 14) * 86400000)
      .toISOString()
      .slice(0, 10),
    descricao:
      Math.random() > 0.5 ? "Recebimento de venda" : "Pagamento fornecedor",
    tipo: Math.random() > 0.5 ? "Entrada" : "Saída",
    valor: rnd(180, 12500),
    status: statusPool[rnd(0, statusPool.length - 1)],
  }));

  return {
    faturamentoTotal: {
      total: faturamentoTotal,
      variacao,
      series: receitaSeries,
    },
    contasReceber: { total: contasReceberTotal, porVencimento },
    contasPagar: { total: contasPagarTotal, porCategoria },
    saldoCaixa: {
      total: saldoSeries[saldoSeries.length - 1],
      series: saldoSeries,
    },
    lucroLiquido: {
      total: lucroTotal,
      series: { receita: receitaSeries, despesas: despesaSeries },
    },
    despesasCategoria,
    receitaPorPagamento,
    inadimplencia: { percentual: inadPercentual, series: inadSeries },
    ticketMedio: { valor: ticketMedioValor, series: ticketSeries },
    projecaoReceita,
    topClientes,
    ultimasMovimentacoes,
  };
}
