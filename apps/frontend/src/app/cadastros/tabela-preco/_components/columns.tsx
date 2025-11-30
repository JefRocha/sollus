"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";

export type TabelaPreco = { id: number; nome: string; principal: string; principal_label?: string; coeficiente: number };

function formatCoef(v: number) {
  try { return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(v ?? 0); } catch { return String(v ?? 0); }
}

export const columns: ColumnDef<TabelaPreco>[] = [
  { accessorKey: "id", header: ({ column }) => (<DataTableColumnHeader column={column} title="Id" />) },
  { accessorKey: "nome", header: ({ column }) => (<DataTableColumnHeader column={column} title="Nome" />) },
  { accessorKey: "principal_label", header: ({ column }) => (<DataTableColumnHeader column={column} title="Principal" />) },
  { accessorKey: "coeficiente", header: ({ column }) => (<DataTableColumnHeader column={column} title="Coeficiente" />), cell: ({ row }) => (<span>{formatCoef(row.getValue("coeficiente"))}</span>) },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} resource="/cadastros/tabela-preco" resourceName="Tabela de Preço" />
    ),
  },
];

