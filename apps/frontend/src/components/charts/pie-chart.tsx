"use client";

interface ChartProps {
  data: number[];
  labels?: string[];
}

function PieChartComp({ data, labels }: ChartProps) {
  const total = data.reduce((a, b) => a + (Number(b) || 0), 0) || 1;
  let acc = 0;
  const colors = ["text-primary", "text-accent", "text-secondary", "text-muted-foreground"];
  return (
    <svg viewBox="0 0 300 150" className="h-48 w-full">
      <g>
        {data.map((v, i) => {
          const start = (acc / total) * Math.PI * 2;
          acc += Number(v) || 0;
          const end = (acc / total) * Math.PI * 2;
          const x1 = 75 + 60 * Math.cos(start);
          const y1 = 75 + 60 * Math.sin(start);
          const x2 = 75 + 60 * Math.cos(end);
          const y2 = 75 + 60 * Math.sin(end);
          const large = end - start > Math.PI ? 1 : 0;
          return (
            <path key={i} d={`M75,75 L ${x1},${y1} A 60,60 0 ${large} 1 ${x2},${y2} Z`} className={`${colors[i % colors.length]} fill-current`} />
          );
        })}
      </g>
      <g transform="translate(160,20)">
        {(labels && labels.length === data.length ? labels : data.map((_, i) => `S${i + 1}`)).map((lab, i) => (
          <g key={i} transform={`translate(0, ${i * 16})`}>
            <rect width="10" height="10" className={`${colors[i % colors.length]} fill-current`} />
            <text x="16" y="9" className="fill-muted-foreground text-[10px]">{lab}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export default PieChartComp;
export const PieChart = PieChartComp;
