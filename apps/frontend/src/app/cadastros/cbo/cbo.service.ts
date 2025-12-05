import { apiFetch, isErrorResult } from '@/lib/api';

const ENDPOINT = `/cbo`;

export type Cbo = {
    id: number;
    codigo?: string;
    codigo1994?: string;
    nome?: string;
    observacao?: string;
}

/**
 * Busca uma lista de Cbo.
 * Como CBO é uma tabela global, não precisamos passar o tenantId.
 */
export async function getCbos(): Promise<Cbo[]> {
    const data = await apiFetch<Cbo[]>([ENDPOINT, `/cbos`, `/api${ENDPOINT}`, `/cadastros${ENDPOINT}`], { suppressErrorLog: true });
    if (isErrorResult(data)) {
        return [];
    }
    return data;
}

/**
 * Busca um(a) Cbo específico(a) pelo ID.
 */
export async function getCboById(id: number): Promise<Cbo> {
    const data = await apiFetch<Cbo>([
        `${ENDPOINT}/${id}`,
        `/cbos/${id}`,
        `/api${ENDPOINT}/${id}`,
        `/cadastros${ENDPOINT}/${id}`,
    ], { suppressErrorLog: true });
    if (isErrorResult(data)) {
        throw new Error('Falha ao buscar CBO');
    }
    return data;
}

/**
 * Cria um(a) novo(a) Cbo.
 */
export async function createCbo(data: Omit<Cbo, 'id'>): Promise<Cbo> {
    const res = await apiFetch<Cbo>([ENDPOINT, `/cbos`, `/api${ENDPOINT}`, `/cadastros${ENDPOINT}`], {
        method: 'POST',
        body: JSON.stringify(data),
        suppressErrorLog: true,
    });
    if (isErrorResult(res)) throw new Error('Erro ao criar CBO');
    return res;
}

/**
 * Atualiza um(a) Cbo existente.
 * @param id O ID do(a) Cbo a ser atualizado(a).
 * @param data Os dados a serem atualizados.
 */
export async function updateCbo(id: number, data: Partial<Omit<Cbo, 'id'>>): Promise<Cbo> {
    const res = await apiFetch<Cbo>([
        `${ENDPOINT}/${id}`,
        `/cbos/${id}`,
        `/api${ENDPOINT}/${id}`,
        `/cadastros${ENDPOINT}/${id}`,
    ], {
        method: 'PUT',
        body: JSON.stringify(data),
        suppressErrorLog: true,
    });
    if (isErrorResult(res)) throw new Error('Erro ao atualizar CBO');
    return res;
}

/**
 * Deleta um(a) Cbo.
 * @param id O ID do(a) Cbo a ser deletado(a).
 */
export async function deleteCbo(id: number): Promise<void> {
    await apiFetch<void>([
        `${ENDPOINT}/${id}`,
        `/cbos/${id}`,
        `/api${ENDPOINT}/${id}`,
        `/cadastros${ENDPOINT}/${id}`,
    ], {
        method: 'DELETE',
        suppressErrorLog: true,
    });
}
