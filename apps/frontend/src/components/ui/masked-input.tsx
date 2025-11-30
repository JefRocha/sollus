import * as React from "react";
import { cn } from "@/lib/utils";

export function applyMask(value: string, mask: string) {
  const digits = value.replace(/\D+/g, "");
  let out = "";
  let j = 0;
  for (let i = 0; i < mask.length && j < digits.length; i++) {
    if (mask[i] === "#") {
      out += digits[j++];
    } else {
      out += mask[i];
    }
  }
  return out;
}

export type MaskedInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  mask: string;
};

export function MaskedInput({ className, mask, value, onChange, ...props }: MaskedInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = applyMask(e.target.value, mask);
    onChange?.({ ...e, target: { ...e.target, value: masked } } as React.ChangeEvent<HTMLInputElement>);
  }
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm",
        "ring-offset-background placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      value={(value as string) ?? ""}
      onChange={handleChange}
      {...props}
    />
  );
}

