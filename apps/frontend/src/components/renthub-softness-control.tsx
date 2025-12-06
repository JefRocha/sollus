"use client";

import React from "react";
import { useTheme } from "next-themes";

function setRenthubSoftness(value: number) {
  const v = Math.max(0, Math.min(100, value));
  const root = document.documentElement;
  const glass = 90 - v * 0.3; // 90%..60%
  const a = Math.max(0, +(6 - v * 0.04).toFixed(2)); // 6%..2%
  const b = Math.max(0, +(5 - v * 0.03).toFixed(2)); // 5%..2%
  const base = Math.max(0, +(12 - v * 0.08).toFixed(2)); // 12%..4%
  const blur = +(12 - v * 0.04).toFixed(2); // 12..8px
  const shadowCard = +(0.28 - v * 0.0011).toFixed(3); // 0.28..0.17
  const shadowPanel = +(0.22 - v * 0.001).toFixed(3); // 0.22..0.12
  const borderAlpha = +(0.10 - v * 0.0002).toFixed(3); // 0.10..0.08

  root.style.setProperty("--renthub-glass-amount", `${glass}%`);
  root.style.setProperty("--renthub-overlay-a", `${a}%`);
  root.style.setProperty("--renthub-overlay-b", `${b}%`);
  root.style.setProperty("--renthub-overlay-base", `${base}%`);
  root.style.setProperty("--renthub-blur", `${blur}px`);
  root.style.setProperty("--renthub-shadow", `${shadowCard}`);
  root.style.setProperty("--renthub-shadow-panel", `${shadowPanel}`);
  root.style.setProperty("--renthub-border-alpha", `${borderAlpha}`);
  try {
    localStorage.setItem("renthub:softness", String(v));
  } catch {}
}

export function RentHubSoftnessControl() {
  const { theme } = useTheme();
  const [value, setValue] = React.useState<number>(() => {
    if (typeof window === "undefined") return 50;
    const saved = Number(localStorage.getItem("renthub:softness") || 50);
    return Number.isFinite(saved) ? saved : 50;
  });

  React.useEffect(() => {
    if (theme === "renthub") setRenthubSoftness(value);
  }, [theme]);

  if (theme !== "renthub") return null;

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <label className="text-sm text-muted-foreground">Suavidade RentHub</label>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          setValue(v);
          setRenthubSoftness(v);
        }}
        className="w-36"
      />
      <span className="text-xs text-muted-foreground">{value}%</span>
    </div>
  );
}

