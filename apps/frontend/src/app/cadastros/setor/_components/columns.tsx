"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";

export type Setor = { id: number; nome: string; observacao?: string };

export const columns: ColumnDef<Setor>[] = [
  { accessorKey: "id", header: ({ column }) => (<DataTableColumnHeader column={column} title="ID" />) },
  { accessorKey: "nome", header: ({ column }) => (<DataTableColumnHeader column={column} title="Nome" />) },
  { accessorKey: "descricao", header: ({ column }) => (<DataTableColumnHeader column={column} title="Descrição" />) },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} resource="/cadastros/setor" resourceName="Setor" />
    ),
  },
];

