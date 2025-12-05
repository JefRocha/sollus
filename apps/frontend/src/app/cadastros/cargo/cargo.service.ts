import { apiFetch, isErrorResult } from "@/lib/api";

const ENDPOINT = `/cargo`;

export type Cargo = {
  id: number;
  nome: string;
  descricao?: string;
  salario: number;
  cbo1994?: string;
  cbo2002?: string;
};

/**
 * Busca uma lista de Cargo.
 */
export async function getCargos(): Promise<Cargo[]> {
  const res = await apiFetch<any>(["/cargo", "/cargos", "/api/cargo", "/cadastros/cargo"], { suppressErrorLog: true });
  if (isErrorResult(res)) return [];
  return Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : (Array.isArray(res?.content) ? res.content : []));
}

/**
 * Busca um(a) Cargo específico(a) pelo ID.
 * @param id O ID do(a) Cargo.
 */
export async function getCargoById(id: number): Promise<Cargo> {
  const r = await apiFetch<any>([`/cargo/${id}`, `/cargos/${id}`, `/api/cargo/${id}`, `/cadastros/cargo/${id}`], { suppressErrorLog: true });
  if (!isErrorResult(r)) return r;
  const list = await getCargos();
  const found = list.find((c) => c.id === id);
  if (!found) return { id, nome: "", descricao: "", salario: 0 } as any;
  return found;
}

/**
 * Cria um(a) novo(a) Cargo.
 * @param data Os dados para o(a) novo(a) Cargo.
 */
export async function createCargo(data: Omit<Cargo, "id">): Promise<Cargo> {
  const res = await apiFetch<Cargo>(["/cargo", "/cargos", "/api/cargo", "/cadastros/cargo"], { method: "POST", body: JSON.stringify(data), suppressErrorLog: true });
  return res;
}

/**
 * Atualiza um(a) Cargo existente.
 * @param id O ID do(a) Cargo a ser atualizado(a).
 * @param data Os dados a serem atualizados.
 */
export async function updateCargo(
  id: number,
  data: Partial<Omit<Cargo, "id">>
): Promise<Cargo> {
  const res = await apiFetch<Cargo>([`/cargo/${id}`, `/cargos/${id}`, `/api/cargo/${id}`, `/cadastros/cargo/${id}`], { method: "PUT", body: JSON.stringify(data), suppressErrorLog: true });
  return res;
}

/**
 * Deleta um(a) Cargo.
 * @param id O ID do(a) Cargo a ser deletado(a).
 */
export async function deleteCargo(id: number): Promise<void> {
  await apiFetch<void>([`/cargo/${id}`, `/cargos/${id}`, `/api/cargo/${id}`, `/cadastros/cargo/${id}`], { method: "DELETE", suppressErrorLog: true });
}
