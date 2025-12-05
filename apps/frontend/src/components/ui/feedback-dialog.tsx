"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2, XCircle, Info } from "lucide-react";

type Variant = "success" | "error" | "info";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: Variant;
  title: string;
  description?: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export function FeedbackDialog({
  open,
  onOpenChange,
  variant = "info",
  title,
  description,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: FeedbackDialogProps) {
  const palette = {
    success: {
      bg: "bg-green-500/10",
      fg: "text-green-600",
      border: "border-green-500/20",
    },
    error: {
      bg: "bg-red-500/10",
      fg: "text-red-600",
      border: "border-red-500/20",
    },
    info: {
      bg: "bg-blue-500/10",
      fg: "text-blue-600",
      border: "border-blue-500/20",
    },
  } as const;

  const icon = {
    success: <CheckCircle2 className="size-5" />,
    error: <XCircle className="size-5" />,
    info: <Info className="size-5" />,
  }[variant];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={`sm:max-w-md rounded-2xl border ${palette[variant].border} bg-card/95 backdrop-blur p-6 shadow-2xl`}
      >
        <AlertDialogHeader className="pb-2">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex size-12 items-center justify-center rounded-full ${palette[variant].bg} ${palette[variant].fg}`}
            >
              {icon}
            </span>
            <AlertDialogTitle className="text-3xl font-semibold">
              {title}
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>
        {description && (
          <AlertDialogDescription className="mt-1 text-base text-muted-foreground">
            {description}
          </AlertDialogDescription>
        )}
        <AlertDialogFooter className="mt-4 gap-2">
          {secondaryLabel && onSecondary && (
            <AlertDialogAction
              className="bg-muted text-foreground hover:bg-muted/80 h-9 px-4 text-sm"
              onClick={onSecondary}
            >
              {secondaryLabel}
            </AlertDialogAction>
          )}
          <AlertDialogAction
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 text-sm"
            onClick={onPrimary}
          >
            {primaryLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
