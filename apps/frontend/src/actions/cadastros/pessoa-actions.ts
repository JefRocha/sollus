"use server";

import { apiServerAction } from "@/lib/api-server-action";
import { revalidatePath } from "next/cache";

export type OptionItem = {
  id: number;
  nome: string;
};

export type Pessoa = {
  id: number;
  nome: string;
  tipo: "F" | "J";
  site?: string;
  email?: string;
  eh_cliente: "S" | "N";
  eh_fornecedor?: "S" | "N";
  eh_transportadora?: "S" | "N";
  eh_colaborador?: "S" | "N";
  eh_contador?: "S" | "N";
  clienteModel?: any;
  fornecedorModel?: any;
  transportadoraModel?: any;
  colaboradorModel?: any;
  contadorModel?: any;
  pessoaFisicaModel?: any;
  pessoaJuridicaModel?: any;
  pessoaContatoModelList?: any[];
  pessoaTelefoneModelList?: any[];
  pessoaEnderecoModelList?: any[];
};

export type PessoaListQuery = {
  page?: number;
  limit?: number;
  q?: string;
  field?: string;
  tipo?: "F" | "J";
  role?:
    | "cliente"
    | "fornecedor"
    | "transportadora"
    | "colaborador"
    | "contador"
    | "all";
  sort?: string; // ex: "nome,asc"
};

export async function getPessoas(input: PessoaListQuery = {}) {
  try {
    const page = Number(input.page ?? 1);
    const limit = Number(input.limit ?? 15);
    const field = input.field || "nome";
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));

    const q = input.q?.trim();
    if (q) {
      const filter =
        q.includes("$cont") || q.includes("$eq") || q.includes("$between")
          ? q
          : `${field}||$cont||${encodeURIComponent(q)}`;
      params.append("filter", filter);
    }
    if (input.tipo === "F" || input.tipo === "J") {
      params.append("filter", `tipo||$eq||${input.tipo}`);
    }
    if (input.role && input.role !== "all") {
      const map: Record<string, string> = {
        cliente: "eh_cliente",
        fornecedor: "eh_fornecedor",
        transportadora: "eh_transportadora",
        colaborador: "eh_colaborador",
        contador: "eh_contador",
      };
      const col = map[input.role];
      if (col) params.append("filter", `${col}||$eq||S`);
    }

    // Ensure sort order is uppercase
    if (input.sort) {
      const [sortField, sortOrder = "ASC"] = input.sort.split(",");
      params.append("sort", `${sortField},${sortOrder.toUpperCase()}`);
    } else {
      params.append("sort", "nome,ASC");
    }

    const endpoint = `/api/pessoa?${params.toString()}`;
    const res = await apiServerAction<any>(endpoint);

    const pessoas = Array.isArray(res)
      ? res
      : res.data || res.content || res.items || [];
    const total =
      typeof res?.total === "number"
        ? res.total
        : res.totalElements || res.count || pessoas.length;
    const currentPage =
      typeof res?.page === "number"
        ? res.page
        : res.number != null
        ? res.number + 1
        : page;
    const pageSize =
      typeof res?.limit === "number" ? res.limit : res.size || limit;

    return { query: input, pessoas, total, page: currentPage, limit: pageSize };
  } catch (error: any) {
    console.error("[PessoaAction] Error fetching pessoas:", error);
    return {
      query: input,
      pessoas: [],
      total: 0,
      page: 1,
      limit: 15,
      error: `Falha ao buscar pessoas: ${error.message}`,
    };
  }
}

export async function getPessoa(id: number) {
  return apiServerAction<Pessoa>(`/api/pessoa/${id}`);
}

export async function createPessoa(data: Pessoa) {
  const res = await apiServerAction<Pessoa>("/api/pessoa", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/cadastros/pessoa");
  return res;
}

export async function updatePessoa(data: Pessoa) {
  const res = await apiServerAction<Pessoa>(`/api/pessoa/${data.id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/cadastros/pessoa");
  return res;
}

export async function getNivelFormacao(q: string = ""): Promise<OptionItem[]> {
  const params = new URLSearchParams();
  params.append("filter", q);
  return apiServerAction<OptionItem[]>(
    `/api/nivel-formacao?${params.toString()}`
  );
}

export async function getEstadoCivil(q: string = ""): Promise<OptionItem[]> {
  const params = new URLSearchParams();
  params.append("filter", q);
  return apiServerAction<OptionItem[]>(
    `/api/estado-civil?${params.toString()}`
  );
}
