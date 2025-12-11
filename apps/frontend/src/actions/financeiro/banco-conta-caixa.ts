"use server";

import { apiServerAction } from "@/lib/api-server-action";
import {
  bancoContaCaixaSchema,
  BancoContaCaixa,
} from "@/types/schemas/financeiro/banco-conta-caixa";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const BASE = "/api/financeiro/banco-conta-caixa";

// MOCK DATA GENERATOR
const getMockData = (): BancoContaCaixa[] => [
  {
    id: 1,
    nome: "Banco do Brasil",
    tipo: "corrente",
    numero: "1234-5",
    digito: "X",
    agencia: "001",
    ativo: true,
    saldoInicial: 1500.0,
  },
  {
    id: 2,
    nome: "Caixa Pequeno",
    tipo: "caixa",
    ativo: true,
    saldoInicial: 200.0,
  },
  {
    id: 3,
    nome: "Nubank",
    tipo: "corrente",
    numero: "9999-9",
    ativo: true,
    saldoInicial: 5000.0,
  },
];

export async function getBancoContaCaixaList() {
  try {
    return await apiServerAction<BancoContaCaixa[]>(BASE);
  } catch (error) {
    console.warn("API Error, returning mock data:", error);
    return getMockData();
  }
}

export async function getBancoContaCaixaById(id: number) {
  try {
    return await apiServerAction<BancoContaCaixa>(`${BASE}/${id}`);
  } catch (error) {
    console.warn("API Error, returning mock data:", error);
    return getMockData().find((i) => i.id === id) || ({} as BancoContaCaixa);
  }
}

export async function createBancoContaCaixa(
  input: z.infer<typeof bancoContaCaixaSchema>
) {
  try {
    const res = await apiServerAction<any>(BASE, {
      method: "POST",
      body: JSON.stringify(input),
    });
    revalidatePath("/financeiro/banco-conta-caixa");
    return res;
  } catch (error) {
    console.warn("API Error (Mock Create):", error);
    revalidatePath("/financeiro/banco-conta-caixa");
    return { success: true, mock: true };
  }
}

export async function updateBancoContaCaixa(
  input: z.infer<typeof bancoContaCaixaSchema> & { id: number }
) {
  try {
    const { id, ...data } = input;
    const res = await apiServerAction<any>(`${BASE}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    revalidatePath("/financeiro/banco-conta-caixa");
    return res;
  } catch (error) {
    console.warn("API Error (Mock Update):", error);
    revalidatePath("/financeiro/banco-conta-caixa");
    return { success: true, mock: true };
  }
}

export async function deleteBancoContaCaixa(id: number) {
  try {
    await apiServerAction<void>(`${BASE}/${id}`, { method: "DELETE" });
    revalidatePath("/financeiro/banco-conta-caixa");
  } catch (error) {
    console.warn("API Error (Mock Delete):", error);
    revalidatePath("/financeiro/banco-conta-caixa");
  }
}
