"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Usuario } from "../usuario.service";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";

export const columns: ColumnDef<Usuario>[] = [
  {
    accessorKey: "idColaborador",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id Colaborador" />
    ),
  },
  {
    accessorKey: "idPapel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Papel" />
    ),
  },
  {
    accessorKey: "login",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Login" />
    ),
  },
  {
    accessorKey: "senha",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Senha" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        resource="/usuario"
        resourceName="Usuario"
      />
    ),
  },
];
