"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { isMaster } from "@/lib/utils";

export type TipoAdmissao = { id: number; nome: string; observacao?: string };

export const columns: ColumnDef<TipoAdmissao>[] = [
  { accessorKey: "id", header: ({ column }) => (<DataTableColumnHeader column={column} title="ID" />) },
  { accessorKey: "nome", header: ({ column }) => (<DataTableColumnHeader column={column} title="Nome" />) },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} resource="/tipo-admissao" resourceName="Tipo de Admissão" canEdit={isMaster()} canDelete={isMaster()} />
    ),
  },
];

