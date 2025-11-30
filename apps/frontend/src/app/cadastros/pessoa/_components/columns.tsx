"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";

export type Pessoa = {
    id: number;
    nome: string;
    tipo: string;
    email?: string;
    ehCliente: string;
    ehFornecedor?: string;
    ehTransportadora?: string;
    ehColaborador?: string;
    ehContador?: string;
};

function labelTipo(v?: string) {
    return v === "F" ? "Física" : v === "J" ? "Jurídica" : "";
}

function labelSN(v?: string) {
    return v === "S" ? "Sim" : v === "N" ? "Não" : "";
}

export const columns: ColumnDef<Pessoa>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID" />
        ),
    },
    {
        accessorKey: "nome",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nome" />
        ),
    },
    {
        accessorKey: "tipo",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tipo" />
        ),
        cell: ({ row }) => labelTipo(row.getValue("tipo")),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: "ehCliente",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Cliente" />
        ),
        cell: ({ row }) => labelSN(row.getValue("ehCliente")),
    },
    {
        accessorKey: "ehFornecedor",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Fornecedor" />
        ),
        cell: ({ row }) => labelSN(row.getValue("ehFornecedor")),
    },
    {
        accessorKey: "ehTransportadora",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Transportadora" />
        ),
        cell: ({ row }) => labelSN(row.getValue("ehTransportadora")),
    },
    {
        accessorKey: "ehColaborador",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Colaborador" />
        ),
        cell: ({ row }) => labelSN(row.getValue("ehColaborador")),
    },
    {
        accessorKey: "ehContador",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Contador" />
        ),
        cell: ({ row }) => labelSN(row.getValue("ehContador")),
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <DataTableRowActions
                row={row}
                resource="/cadastros/pessoa"
                resourceName="Pessoa"
            />
        ),
    },
];
