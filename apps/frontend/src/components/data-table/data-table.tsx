'use client';

import * as React from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    filterBy?: string;
    createHref?: string;
    createText?: string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filterBy,
    createHref,
    createText = 'Criar Novo',
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    // Carregar pageSize do localStorage ou usar 15 como padrão
    const [pageSize, setPageSize] = React.useState<number>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('dataTablePageSize');
            return saved ? parseInt(saved, 10) : 15;
        }
        return 15;
    });

    // Salvar pageSize no localStorage quando mudar
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('dataTablePageSize', pageSize.toString());
        }
    }, [pageSize]);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        initialState: {
            pagination: {
                pageSize: pageSize,
            },
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: {
                pageIndex: 0,
                pageSize: pageSize,
            },
        },
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                {filterBy && (
                    <Input
                        placeholder={`Filtrar por ${filterBy}...`}
                        value={(table.getColumn(filterBy)?.getFilterValue() as string) ?? ''}
                        onChange={(event) =>
                            table.getColumn(filterBy)?.setFilterValue(event.target.value)
                        }
                        className="flex-1"
                    />
                )}
                {createHref && (
                    <Link href={createHref}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            {createText}
                        </Button>
                    </Link>
                )}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Nenhum resultado encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} registro(s) encontrado(s).
                </div>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Registros por página</p>
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => {
                                const newSize = Number(e.target.value);
                                table.setPageSize(newSize);
                                setPageSize(newSize);
                            }}
                            className="h-8 w-[70px] rounded-md border border-input bg-transparent px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            {[10, 15, 25, 50, 100].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium">
                            Página {table.getState().pagination.pageIndex + 1} de{' '}
                            {table.getPageCount()}
                        </div>
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Próxima
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
