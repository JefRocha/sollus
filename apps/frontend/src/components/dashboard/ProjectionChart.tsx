"use client";

export default function ProjectionChart({
  data,
}: {
  data: { dias30: number[]; dias60: number[]; dias90: number[] };
}) {
  const max = Math.max(...data.dias30, ...data.dias60, ...data.dias90, 1);
  const toPts = (arr: number[]) =>
    arr
      .map((v, i) => `${i * 24},${120 - Math.round((v / max) * 100)}`)
      .join(" ");
  return (
    <div className="relative h-36 w-full">
      <svg viewBox="0 0 360 120" className="h-full w-full">
        <polyline
          points={toPts(data.dias30)}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
        />
        <polyline
          points={toPts(data.dias60)}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-blue-500"
        />
        <polyline
          points={toPts(data.dias90)}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-violet-500"
        />
      </svg>
    </div>
  );
}
