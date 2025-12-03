"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { BancoSchema } from "../banco.zod.schema";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<BancoSchema>[] = [
    {
        accessorKey: "codigo",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Código" />
        ),
    },
    {
        accessorKey: "nome",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nome" />
        ),
    },
    {
        accessorKey: "url",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="URL" />
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
