"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Cargo } from "../cargo.service";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";

export const columns: ColumnDef<Cargo>[] = [
  {
    accessorKey: "nome",
    header: ({ column }) => (
      <DataTableColumnHeader column= { column } title="Nome" />
    ),
  },
{
  accessorKey: "descricao",
    header: ({ column }) => (
      <DataTableColumnHeader column= { column } title = "Descrição" />
    ),
},
{
  accessorKey: "salario",
    header: ({ column }) => (
      <DataTableColumnHeader column= { column } title = "Valor Salário" />
    ),
},
{
  accessorKey: "cbo1994",
    header: ({ column }) => (
      <DataTableColumnHeader column= { column } title = "CBO 1994" />
    ),
},
{
  id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row= { row }
  resource = "/cadastros/cargo"
  resourceName = "Cargo"
    />
    ),
},
];
