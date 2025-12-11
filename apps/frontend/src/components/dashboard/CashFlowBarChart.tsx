"use client";

export default function CashFlowBarChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="grid grid-cols-12 gap-1 h-24">
      {data.slice(-12).map((v, i) => (
        <div
          key={i}
          className="bg-primary/70"
          style={{ height: `${Math.round((v / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}
