"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";

export type Sindicato = { id: number; nome: string; observacao?: string };

export const columns: ColumnDef<Sindicato>[] = [
  { accessorKey: "id", header: ({ column }) => (<DataTableColumnHeader column={column} title="ID" />) },
  { accessorKey: "nome", header: ({ column }) => (<DataTableColumnHeader column={column} title="Nome" />) },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} resource="/sindicato" resourceName="Sindicato" />
    ),
  },
];

