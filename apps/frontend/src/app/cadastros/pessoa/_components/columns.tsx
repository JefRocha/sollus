"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";

export type Pessoa = {
    id: number;
    nome: string;
    tipo: string;
    email?: string;
    eh_cliente: string;
    eh_fornecedor?: string;
    eh_transportadora?: string;
    eh_colaborador?: string;
    eh_contador?: string;
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
        accessorKey: "eh_cliente",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Cliente" />
        ),
        cell: ({ row }) => labelSN(row.getValue("eh_cliente")),
    },
    {
        accessorKey: "eh_fornecedor",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Fornecedor" />
        ),
        cell: ({ row }) => labelSN(row.getValue("eh_fornecedor")),
    },
    {
        accessorKey: "eh_transportadora",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Transportadora" />
        ),
        cell: ({ row }) => labelSN(row.getValue("eh_transportadora")),
    },
    {
        accessorKey: "eh_colaborador",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Colaborador" />
        ),
        cell: ({ row }) => labelSN(row.getValue("eh_colaborador")),
    },
    {
        accessorKey: "eh_contador",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Contador" />
        ),
        cell: ({ row }) => labelSN(row.getValue("eh_contador")),
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
