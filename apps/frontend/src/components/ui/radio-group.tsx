"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Ctx = { value?: string; onValueChange?: (v: string) => void };
const RadioCtx = React.createContext<Ctx>({});

type GroupProps = {
  value?: string;
  onValueChange?: (v: string) => void;
  className?: string;
  children?: React.ReactNode;
};

function RadioGroup({ value, onValueChange, className, children }: GroupProps) {
  return (
    <RadioCtx.Provider value={{ value, onValueChange }}>
      <div data-slot="radio-group" className={cn("grid gap-2", className)}>
        {children}
      </div>
    </RadioCtx.Provider>
  );
}

type ItemProps = {
  value: string;
  id?: string;
  className?: string;
  disabled?: boolean;
};

function RadioGroupItem({ value, id, className, disabled }: ItemProps) {
  const { value: current, onValueChange } = React.useContext(RadioCtx);
  const checked = current === value;
  return (
    <div
      data-slot="radio-group-item"
      className={cn("inline-flex items-center", className)}
    >
      <input
        type="radio"
        id={id}
        name="radio-group"
        checked={!!checked}
        onChange={() => onValueChange?.(value)}
        className="peer sr-only"
        disabled={disabled}
      />
      <span
        className={cn(
          "inline-flex items-center justify-center h-4 w-4 rounded-full border border-input text-primary shadow-xs outline-none transition-colors",
          disabled && "opacity-50"
        )}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-primary" />}
      </span>
    </div>
  );
}

export { RadioGroup, RadioGroupItem };
