"use client";

export default function ProfitAreaChart({
  receita,
  despesas,
}: {
  receita: number[];
  despesas: number[];
}) {
  const m = Math.max(...receita, ...despesas, 1);
  const toPts = (arr: number[]) =>
    arr.map((v, i) => `${i * 24},${120 - Math.round((v / m) * 100)}`).join(" ");
  return (
    <div className="relative h-36 w-full">
      <svg viewBox="0 0 360 120" className="h-full w-full">
        <polyline
          points={toPts(receita)}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-emerald-500"
        />
        <polyline
          points={toPts(despesas)}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-red-500"
        />
      </svg>
    </div>
  );
}
