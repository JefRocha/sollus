"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";

export type Produto = { id: number; nome: string; valorCompra?: number; valorVenda?: number };

function fmt(v?: number) { try { return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(v ?? 0); } catch { return String(v ?? 0); } }

export const columns: ColumnDef<Produto>[] = [
  { accessorKey: "id", header: ({ column }) => (<DataTableColumnHeader column={column} title="ID" />) },
  { accessorKey: "nome", header: ({ column }) => (<DataTableColumnHeader column={column} title="Nome" />) },
  { accessorKey: "valorCompra", header: ({ column }) => (<DataTableColumnHeader column={column} title="Compra" />), cell: ({ row }) => (<span>{fmt(row.getValue("valorCompra"))}</span>) },
  { accessorKey: "valorVenda", header: ({ column }) => (<DataTableColumnHeader column={column} title="Venda" />), cell: ({ row }) => (<span>{fmt(row.getValue("valorVenda"))}</span>) },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} resource="/cadastros/produto" resourceName="Produto" />
    ),
  },
];
