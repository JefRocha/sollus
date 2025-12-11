import { z } from "zod";

export const tipoContaOptions = [
  { label: "Conta Corrente", value: "corrente" },
  { label: "Conta Poupança", value: "poupanca" },
  { label: "Caixa Físico", value: "caixa" },
  { label: "Investimento", value: "investimento" },
] as const;

export const bancoContaCaixaSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.enum(["corrente", "poupanca", "caixa", "investimento"]),
  bancoId: z.number().optional().nullable(),
  numero: z.string().optional(),
  digito: z.string().optional(),
  agencia: z.string().optional(),
  agenciaDigito: z.string().optional(),
  descricao: z.string().optional(),
  saldoInicial: z.number().default(0),
  dataSaldoInicial: z.string().optional(),
  ativo: z.boolean().default(true),
});

export type BancoContaCaixa = z.infer<typeof bancoContaCaixaSchema>;
