"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Cargo } from "../cargo.service";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import dynamic from "next/dynamic";
const RowActions = dynamic(
  () => import("./cell-action").then((m) => m.CellAction),
  { ssr: false }
);

export const columns: ColumnDef<Cargo>[] = [
  {
    accessorKey: "nome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
  },
  {
    accessorKey: "descricao",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
  },
  {
    accessorKey: "salario",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor Salário" />
    ),
  },
  {
    accessorKey: "cbo1994",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CBO 1994" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} />,
  },
];
