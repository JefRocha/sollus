"use client";

interface ChartProps {
  data: number[];
  labels?: string[];
}

function LineChartComp({ data, labels }: ChartProps) {
  const w = 600;
  const h = 240;
  const pl = 40;
  const pr = 20;
  const pt = 16;
  const pb = 28;
  const max = Math.max(...data, 1);
  const span = (w - pl - pr) / Math.max(1, data.length - 1);
  const toX = (i: number) => pl + i * span;
  const toY = (v: number) => pt + (h - pt - pb) * (1 - v / max);
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`).join(' ');
  const gridLines = [0.2, 0.4, 0.6, 0.8].map((g, i) => (
    <line key={i} x1={pl} x2={w - pr} y1={pt + (h - pt - pb) * (1 - g)} y2={pt + (h - pt - pb) * (1 - g)} className="stroke-muted-foreground/20" strokeWidth={1} />
  ));
  const xLabels = (labels && labels.length === data.length ? labels : Array.from({ length: data.length }, (_, i) => `${i + 1}`));
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-48 w-full">
      <rect x={pl} y={pt} width={w - pl - pr} height={h - pt - pb} className="fill-transparent" />
      {gridLines}
      <line x1={pl} x2={w - pr} y1={h - pb} y2={h - pb} className="stroke-muted-foreground/30" strokeWidth={1} />
      <path d={path} className="stroke-primary" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={toX(i)} cy={toY(v)} r={3} className="fill-primary" />
      ))}
      {xLabels.map((lab, i) => (
        <text key={i} x={toX(i)} y={h - 10} textAnchor="middle" className="fill-muted-foreground text-[10px]">{lab}</text>
      ))}
    </svg>
  );
}

export default LineChartComp;
export const LineChart = LineChartComp;
