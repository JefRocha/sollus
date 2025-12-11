import { z } from "zod";

export const finChequeEmitidoSchema = z.object({
  id: z.number().optional(),
  idCheque: z.number().min(1, "Número do cheque obrigatório"),
  idBancoContaCaixa: z.number().min(1, "Conta bancária obrigatória"),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
  nominalA: z.string().min(1, "Nominal obrigatório"),
  bomPara: z.string().optional(),
  dataEmissao: z.string().optional(),
  historico: z.string().optional(),
  situacao: z
    .enum(["Aberto", "Compensado", "Cancelado", "Devolvido"])
    .default("Aberto"),
});

export type FinChequeEmitido = z.infer<typeof finChequeEmitidoSchema>;
