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

export async function getPessoas(searchParams: any) {
  try {
    const params = new URLSearchParams();
    if (searchParams?.q) {
      params.append("filter", searchParams.q);
    }

    const queryString = params.toString();
    const endpoint = `/api/pessoa${queryString ? `?${queryString}` : ""}`;

    const data = await apiServerAction<any[]>(endpoint);
    return { pessoas: data };
  } catch (error) {
    console.error("[PessoaAction] Error fetching pessoas:", error);
    return { error: "Falha ao buscar pessoas" };
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
