"use client";

import React from "react";

function setOpacity(pct: number) {
  const root = document.documentElement;
  const clamp = Math.max(0, Math.min(100, pct));
  root.style.setProperty("--glass-amount", `${clamp}%`);
  const a = Math.max(0, Math.min(30, Math.round(clamp * 0.08))); // ~0–8%
  const b = Math.max(0, Math.min(30, Math.round(clamp * 0.06))); // ~0–6%
  const base = Math.max(0, Math.min(40, Math.round(clamp * 0.18))); // ~0–18%
  root.style.setProperty("--panel-overlay-a", `${a}%`);
  root.style.setProperty("--panel-overlay-b", `${b}%`);
  root.style.setProperty("--panel-overlay-base", `${base}%`);
  try {
    localStorage.setItem("theme:opacity", String(clamp));
  } catch {}
}

export function ThemeTransparencyControl() {
  const [value, setValue] = React.useState<number>(() => {
    if (typeof window === "undefined") return 95;
    const saved = Number(localStorage.getItem("theme:opacity") || 95);
    return Number.isFinite(saved) ? saved : 95;
  });

  React.useEffect(() => {
    setOpacity(value);
  }, []);

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <label className="text-sm text-muted-foreground">Suavidade</label>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          setValue(v);
          setOpacity(v);
        }}
        className="w-36"
      />
      <span className="text-xs text-muted-foreground">{value}%</span>
    </div>
  );
}
