import { z } from "zod";

export const produtoSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(1, "Obrigatório").max(100, "Máximo 100 caracteres"),
  descricao: z.string().max(250, "Máximo 250 caracteres").optional(),
  gtin: z.string().max(14, "Máximo 14 caracteres").optional(),
  codigoInterno: z.string().max(50, "Máximo 50 caracteres").optional(),
  valorCompra: z.union([z.number(), z.string()]).transform((v) => Number(v)).refine((v) => v >= 0, "Valor inválido"),
  valorVenda: z.union([z.number(), z.string()]).transform((v) => Number(v)).refine((v) => v >= 0, "Valor inválido"),
  codigoNcm: z.string().max(8, "Máximo 8 caracteres").optional(),
  dataCadastro: z.string().optional(),
  estoqueMinimo: z.union([z.number(), z.string()]).transform((v) => Number(v)).optional(),
  estoqueMaximo: z.union([z.number(), z.string()]).transform((v) => Number(v)).optional(),
  quantidadeEstoque: z.union([z.number(), z.string()]).transform((v) => Number(v)).optional(),
  produtoSubgrupoModel: z.object({ id: z.number().optional() }).optional(),
  produtoMarcaModel: z.object({ id: z.number().optional() }).optional(),
  produtoUnidadeModel: z.object({ id: z.number().optional() }).optional(),
  tributIcmsCustomCabModel: z.object({ id: z.number().optional() }).optional(),
  tributGrupoTributarioModel: z.object({ id: z.number().optional() }).optional(),
}).refine((v) => (v.valorVenda ?? 0) >= 0 && (v.valorCompra ?? 0) >= 0, {
  message: "Valores inválidos",
});

export type ProdutoSchema = z.infer<typeof produtoSchema>;

