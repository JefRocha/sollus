"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Cbo } from "../cbo.service";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";

export const columns: ColumnDef<Cbo>[] = [
  {
    accessorKey: "codigo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="código cbo 2002" />
    ),
  },
  {
    accessorKey: "codigo1994",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="código cbo 1994" />
    ),
  },
  {
    accessorKey: "nome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="nome" />
    ),
  },
  {
    accessorKey: "observacao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="observação" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        resource="/cbo"
        resourceName="Cbo"
      />
    ),
  },
];
