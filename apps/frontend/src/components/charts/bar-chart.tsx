"use client";

interface ChartProps {
  data: number[];
  labels?: string[];
}

function BarChartComp({ data, labels }: ChartProps) {
  const w = 600;
  const h = 240;
  const pl = 40;
  const pr = 20;
  const pt = 16;
  const pb = 28;
  const max = Math.max(...data, 1);
  const span = (w - pl - pr) / Math.max(1, data.length);
  const barW = Math.max(12, span * 0.6);
  const toX = (i: number) => pl + i * span + (span - barW) / 2;
  const toH = (v: number) => Math.round((v / max) * (h - pt - pb));
  const xLabels = (labels && labels.length === data.length ? labels : Array.from({ length: data.length }, (_, i) => `${i + 1}`));
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-48 w-full">
      <line x1={pl} x2={w - pr} y1={h - pb} y2={h - pb} className="stroke-muted-foreground/30" strokeWidth={1} />
      {data.map((v, i) => (
        <rect key={i} x={toX(i)} y={h - pb - toH(v)} width={barW} height={toH(v)} rx={4} className="fill-primary" />
      ))}
      {xLabels.map((lab, i) => (
        <text key={i} x={pl + i * span + span / 2} y={h - 10} textAnchor="middle" className="fill-muted-foreground text-[10px]">{lab}</text>
      ))}
    </svg>
  );
}

export default BarChartComp;
export const BarChart = BarChartComp;
