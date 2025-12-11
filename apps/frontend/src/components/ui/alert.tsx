import * as React from "react";
import { cn } from "@/lib/utils";

type AlertProps = React.ComponentProps<"div"> & {
  variant?: "default" | "destructive";
};

function Alert({ className, variant = "default", ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-md border p-3 text-sm",
        variant === "destructive"
          ? "border-destructive/50 text-destructive bg-destructive/10"
          : "border-border bg-card",
        className
      )}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("font-semibold mb-1", className)} {...props} />;
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("text-muted-foreground", className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription };
