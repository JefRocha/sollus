"use client";

import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { deleteCargoAction } from "@/actions/cadastros/cargo-actions";
import { toast } from "sonner";

interface CellActionProps<TData> {
  row: Row<TData>;
}

export function CellAction<TData>({ row }: CellActionProps<TData>) {
  const router = useRouter();
  const data = row.original as any;
  const { execute, status } = useAction(deleteCargoAction, {
    onSuccess: () => toast.success("Cargo excluído"),
    onError: () => toast.error("Erro ao excluir Cargo"),
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/cadastros/cargo/${data.id}`)}
        >
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={status === "executing"}
          onClick={() => execute({ id: data.id })}
        >
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
