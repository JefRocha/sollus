"use client";

interface ChartProps {
  data: number[];
  labels?: string[];
}

function AreaChartComp({ data, labels }: ChartProps) {
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
  const dPath = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`).join(' ');
  const areaPts = `${pl},${h - pb} ${data.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')} ${w - pr},${h - pb}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-48 w-full">
      <defs>
        <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.2} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={dPath} className="stroke-primary" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <polygon points={areaPts} fill="url(#areaGrad)" className="text-primary" />
    </svg>
  );
}

export default AreaChartComp;
export const AreaChart = AreaChartComp;
