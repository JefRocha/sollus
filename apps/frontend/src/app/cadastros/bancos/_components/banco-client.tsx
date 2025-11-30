"use client";

import { DataTable } from "@/components/data-table/data-table";
import { Banco } from "@/lib/schemas/banco-schema";
import { columns } from "../columns";

interface BancoClientProps {
  data: Banco[];
}

export const BancoClient: React.FC<BancoClientProps> = ({ data }) => {
  return <DataTable columns={columns} data={data} />;
};
