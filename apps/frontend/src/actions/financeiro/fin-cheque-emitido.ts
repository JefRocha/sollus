"use server";

import { actionClient } from "@/lib/safe-action";
import { apiServerAction } from "@/lib/api-server-action";
import { finChequeEmitidoSchema } from "@/types/schemas/financeiro/fin-cheque-emitido";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const RESOURCE = "/api/fin-cheque-emitido";

// Mock Data Generator
const getMockData = () => [
  {
    id: 1,
    idCheque: 101,
    idBancoContaCaixa: 1,
    valor: 1500.0,
    nominalA: "Fornecedor A",
    bomPara: "2025-01-15",
  },
  {
    id: 2,
    idCheque: 102,
    idBancoContaCaixa: 1,
    valor: 350.5,
    nominalA: "Prestador B",
    bomPara: "2025-01-20",
  },
  {
    id: 3,
    idCheque: 103,
    idBancoContaCaixa: 2,
    valor: 5000.0,
    nominalA: "Aluguel",
    bomPara: "2025-02-01",
  },
];

export const getFinChequeEmitidoList = async () => {
  return await apiServerAction<any[]>(RESOURCE);
};

export const getFinChequeEmitidoById = async (id: number) => {
  return await apiServerAction<any>(`${RESOURCE}/${id}`);
};

export const createFinChequeEmitido = actionClient
  .schema(finChequeEmitidoSchema)
  .action(async ({ parsedInput }) => {
    try {
      const response = await apiServerAction(RESOURCE, {
        method: "POST",
        body: JSON.stringify(parsedInput),
      });
      revalidatePath("/financeiro/cheque-emitido");
      return response;
    } catch (error) {
      console.error("API Error on Create:", error);
      throw error;
    }
  });

export const updateFinChequeEmitido = actionClient
  .schema(finChequeEmitidoSchema.extend({ id: z.number() }))
  .action(async ({ parsedInput }) => {
    try {
      const { id, ...data } = parsedInput;
      const response = await apiServerAction(`${RESOURCE}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      revalidatePath("/financeiro/cheque-emitido");
      return response;
    } catch (error) {
      console.error("API Error on Update:", error);
      throw error;
    }
  });

export const deleteFinChequeEmitido = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput }) => {
    try {
      await apiServerAction(`${RESOURCE}/${parsedInput.id}`, {
        method: "DELETE",
      });
      revalidatePath("/financeiro/cheque-emitido");
    } catch (error) {
      console.error("API Error on Delete:", error);
      throw error;
    }
  });
