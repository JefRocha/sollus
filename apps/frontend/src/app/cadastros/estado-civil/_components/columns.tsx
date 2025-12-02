"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { isMaster } from "@/lib/utils";

export type EstadoCivil = { id: number; nome: string; descricao?: string };

export const columns: ColumnDef<EstadoCivil>[] = [
  { accessorKey: "id", header: ({ column }) => (<DataTableColumnHeader column={column} title="ID" />) },
  { accessorKey: "nome", header: ({ column }) => (<DataTableColumnHeader column={column} title="Nome" />) },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} resource="/cadastros/estado-civil" resourceName="Estado Civil" canEdit={isMaster()} canDelete={isMaster()} />
    ),
  },
];

