"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table/data-table-row-actions";

type Colaborador = {
  id: number;
  pessoaModel?: { id?: number; nome?: string };
  cargoModel?: { id?: number; nome?: string };
  setorModel?: { id?: number; nome?: string };
  colaboradorSituacaoModel?: { id?: number; nome?: string };
  tipoAdmissaoModel?: { id?: number; nome?: string };
  colaboradorTipoModel?: { id?: number; nome?: string };
  sindicatoModel?: { id?: number; nome?: string };
  matricula?: string;
  dataCadastro?: string;
  dataAdmissao?: string;
  dataDemissao?: string;
  ctpsNumero?: string;
  ctpsSerie?: string;
  ctpsDataExpedicao?: string;
  ctpsUf?: string;
};

export const columns: ColumnDef<any>[] = [
  { accessorKey: "id", header: ({ column }) => (<DataTableColumnHeader column={column} title="ID" />) },
  { accessorKey: "pessoa.nome", id: "nome", header: ({ column }) => (<DataTableColumnHeader column={column} title="Nome" />) },
  { accessorKey: "matricula", header: ({ column }) => (<DataTableColumnHeader column={column} title="Matrícula" />) },
  { accessorKey: "data_cadastro", header: ({ column }) => (<DataTableColumnHeader column={column} title="Cadastro" />) },
  { accessorKey: "data_admissao", header: ({ column }) => (<DataTableColumnHeader column={column} title="Admissão" />) },
  { accessorKey: "data_demissao", header: ({ column }) => (<DataTableColumnHeader column={column} title="Demissão" />) },
  { accessorKey: "ctps_numero", header: ({ column }) => (<DataTableColumnHeader column={column} title="CTPS nº" />) },
  { accessorKey: "ctps_serie", header: ({ column }) => (<DataTableColumnHeader column={column} title="CTPS série" />) },
  { accessorKey: "ctps_data_expedicao", header: ({ column }) => (<DataTableColumnHeader column={column} title="CTPS expedição" />) },
  { accessorKey: "ctps_uf", header: ({ column }) => (<DataTableColumnHeader column={column} title="CTPS UF" />) },
  { accessorKey: "id_cargo", header: ({ column }) => (<DataTableColumnHeader column={column} title="Cargo (id)" />) },
  { accessorKey: "id_setor", header: ({ column }) => (<DataTableColumnHeader column={column} title="Setor (id)" />) },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} resource="/cadastros/colaborador" resourceName="Colaborador" />
    ),
  },
];
