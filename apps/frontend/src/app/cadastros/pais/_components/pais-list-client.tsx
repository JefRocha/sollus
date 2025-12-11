"use client";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";

export function PaisListClient({ data }: any) {
  return <DataTable data={data} columns={columns} createHref="/cadastros/pais/novo" />;
}
