"use client";

import * as React from "react";
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
} from "@tanstack/react-table";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PaginationState, OnChangeFn } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterBy?: string;
  createHref?: string;
  createText?: string;
  canCreate?: boolean;
  hidePagination?: boolean;
  onRowClick?: (row: TData) => void;
  onRowHover?: (row: TData | null) => void;
  flexibleHeight?: boolean;
  tableClassName?: string;
  density?: "compact" | "normal" | "comfortable";
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterBy,
  createHref,
  createText = "Criar Novo",
  canCreate = true,
  hidePagination = false,
  onRowClick,
  onRowHover,
  flexibleHeight = false,
  tableClassName,
  density = "normal",
}: DataTableProps<TData, TValue>) {
  const pathname = usePathname();
  const storageKey = `dataTable-state-${pathname}`;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });

  // Restore state after mount to avoid hydration mismatch
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.sorting) setSorting(parsed.sorting);
        if (parsed?.columnFilters) setColumnFilters(parsed.columnFilters);
        if (parsed?.columnVisibility)
          setColumnVisibility(parsed.columnVisibility);
        if (parsed?.rowSelection) setRowSelection(parsed.rowSelection);
        if (parsed?.pagination)
          setPagination((old) => ({
            pageIndex: parsed.pagination.pageIndex ?? old.pageIndex,
            pageSize: parsed.pagination.pageSize ?? old.pageSize,
          }));
      }
      const sizeSaved = localStorage.getItem("dataTablePageSize");
      if (sizeSaved) {
        const n = parseInt(sizeSaved, 10);
        if (!Number.isNaN(n)) setPagination((old) => ({ ...old, pageSize: n }));
      }
    } catch (e) {
      console.error("Failed to restore data table state", e);
    }
  }, [storageKey]);

  // Save state changes to localStorage
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const state = {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    };
    localStorage.setItem(storageKey, JSON.stringify(state));
    localStorage.setItem("dataTablePageSize", pagination.pageSize.toString());
  }, [
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    pagination,
    storageKey,
  ]);

  // Wrap setColumnFilters to reset pagination when filters change
  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> =
    React.useCallback((updaterOrValue) => {
      setColumnFilters((old) => {
        const next =
          typeof updaterOrValue === "function"
            ? updaterOrValue(old)
            : updaterOrValue;
        return next;
      });
      setPagination((old) => ({ ...old, pageIndex: 0 }));
    }, []);

  // Memoize row handlers to prevent unnecessary re-renders
  const handleRowClick = React.useCallback(
    (row: TData) => {
      if (onRowClick) onRowClick(row);
    },
    [onRowClick]
  );

  const handleRowHover = React.useCallback(
    (row: TData | null) => {
      if (onRowHover) onRowHover(row);
    },
    [onRowHover]
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: handleColumnFiltersChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const showToolbar = Boolean(filterBy) || Boolean(createHref && canCreate);

  // Remove as classes conflitantes do tbody quando compact
  const tbodyClasses =
    density === "compact"
      ? "[&_tr:last-child]:border-0"
      : "[&_tr:last-child]:border-0 [&_td]:leading-tight";

  // Common table header component
  const TableHeaderRow = React.memo(
    ({ compact = false }: { compact?: boolean }) => (
      <>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr
            key={headerGroup.id}
            className="bg-gradient-to-r from-muted/80 to-muted/40 hover:from-muted hover:to-muted/60 transition-smooth border-b-2 shadow-sm"
          >
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="text-left align-middle font-semibold text-muted-foreground whitespace-nowrap"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </>
    )
  );
  TableHeaderRow.displayName = "TableHeaderRow";

  // Common table body component
  const TableBodyRows = React.memo(() => (
    <>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className="group transition-all duration-200 hover:bg-accent/50 hover:shadow-sm cursor-pointer hover:border-accent/50"
            onClick={() => {
              row.toggleSelected();
              handleRowClick(row.original as TData);
            }}
            onMouseEnter={() => handleRowHover(row.original as TData)}
            onMouseLeave={() => handleRowHover(null)}
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="align-middle">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={columns.length} className="h-24 text-center">
            Nenhum resultado encontrado.
          </td>
        </tr>
      )}
    </>
  ));
  TableBodyRows.displayName = "TableBodyRows";

  return (
    <div className={`flex flex-col h-full space-y-0 ${tableClassName || ""}`}>
      {showToolbar && (
        <div className="flex items-center justify-between gap-4 shrink-0">
          {filterBy && (
            <Input
              placeholder={`Filtrar por ${filterBy}...`}
              value={
                (table.getColumn(filterBy)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(filterBy)?.setFilterValue(event.target.value)
              }
              className="flex-1"
            />
          )}
          {createHref && canCreate && (
            <Link href={createHref}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {createText}
              </Button>
            </Link>
          )}
        </div>
      )}

      {flexibleHeight ? (
        <div className="flex-1 border border-border/50 shadow-sm overflow-hidden bg-card flex flex-col">
          <div className="flex-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table
              className={`w-full caption-bottom text-sm ${
                density === "compact" ? "data-table-compact" : ""
              }`}
              style={
                density === "compact"
                  ? {
                      borderCollapse: "collapse",
                      borderSpacing: 0,
                    }
                  : undefined
              }
            >
              <thead className="sticky top-0 z-10 bg-card [&_tr]:border-b">
                <TableHeaderRow />
              </thead>
              <tbody className={tbodyClasses}>
                <TableBodyRows />
              </tbody>
            </table>
          </div>
          {!hidePagination && (
            <div className="px-6 py-3 bg-background">
              <DataTablePagination table={table} />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex-1 border border-border/50 shadow-sm overflow-hidden bg-card flex flex-col mb-3">
            <div className="overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <table
                className={`w-full caption-bottom text-sm ${
                  density === "compact" ? "data-table-compact" : ""
                }`}
                style={
                  density === "compact"
                    ? {
                        borderCollapse: "collapse",
                        borderSpacing: 0,
                      }
                    : undefined
                }
              >
                <thead className="sticky top-0 z-10 bg-card [&_tr]:border-b">
                  <TableHeaderRow compact />
                </thead>
                <tbody className={tbodyClasses}>
                  <TableBodyRows />
                </tbody>
              </table>
            </div>
          </div>

          {!hidePagination && (
            <div className="mt-2 flex items-center justify-between space-x-2 py-2 px-6 shrink-0 border-t border-border/40 bg-card shadow-sm">
              <div className="flex-1 text-xs text-muted-foreground">
                {table.getFilteredRowModel().rows.length} registro(s)
                encontrado(s).
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <p className="text-xs font-medium">Registros por página</p>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                      table.setPageSize(Number(e.target.value));
                    }}
                    className="h-7 w-[64px] border border-input bg-transparent px-2 py-2 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {[10, 15, 25, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-xs font-medium">
                    Página {table.getState().pagination.pageIndex + 1} de{" "}
                    {table.getPageCount()}
                  </div>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Primeira página"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Próxima página"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    aria-label="Última página"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
