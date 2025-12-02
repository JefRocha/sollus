"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";
import { isMaster } from "@/lib/utils";

export type Municipio = { id: number; nome: string; codigoIbge: number; uf: string };

export const columns: ColumnDef<Municipio>[] = [
  { accessorKey: "id", header: ({ column }) => (<DataTableColumnHeader column={column} title="ID" />) },
  { accessorKey: "nome", header: ({ column }) => (<DataTableColumnHeader column={column} title="Nome" />) },
  { accessorKey: "codigoIbge", header: ({ column }) => (<DataTableColumnHeader column={column} title="IBGE" />) },
  { accessorKey: "uf", header: ({ column }) => (<DataTableColumnHeader column={column} title="UF" />) },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} resource="/cadastros/municipio" resourceName="Município" canEdit={isMaster()} canDelete={isMaster()} />
    ),
  },
];

