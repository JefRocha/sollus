"use client";

export default function ExpensesPieChart({
  data,
}: {
  data: Array<{ label: string; value: number }>;
}) {
  const total = data.reduce((a, b) => a + b.value, 0) || 1;
  let acc = 0;
  const segs = data.map((d, i) => {
    const start = (acc / total) * 2 * Math.PI;
    acc += d.value;
    const end = (acc / total) * 2 * Math.PI;
    const x1 = 60 + 50 * Math.cos(start),
      y1 = 60 + 50 * Math.sin(start);
    const x2 = 60 + 50 * Math.cos(end),
      y2 = 60 + 50 * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    const color = `hsl(${(i * 50) % 360} 70% 50%)`;
    return {
      path: `M60,60 L${x1},${y1} A50,50 0 ${large},1 ${x2},${y2} z`,
      color,
      label: d.label,
    };
  });
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 120 120" className="h-28 w-28">
        {segs.map((s, i) => (
          <path key={i} d={s.path} style={{ fill: s.color }} />
        ))}
      </svg>
      <div className="text-xs space-y-1">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-2">
            <span
              className="inline-block size-2 rounded"
              style={{ backgroundColor: `hsl(${(i * 50) % 360} 70% 50%)` }}
            />
            <span>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
