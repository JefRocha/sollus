"use client";

export default function RevenueLineChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const pts = data
    .map((v, i) => `${i * 24},${120 - Math.round((v / max) * 100)}`)
    .join(" ");
  return (
    <div className="relative h-36 w-full">
      <svg viewBox="0 0 360 120" className="h-full w-full">
        <polyline
          points={pts}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
        />
      </svg>
    </div>
  );
}
