import { apiFetch } from '@/lib/api';

const ENDPOINT = `/cbo`;

export type Cbo = {
    id: number;
    codigo: string;
    codigo1994: string;
    nome: string;
    observacao: string;
}

/**
 * Busca uma lista de Cbo.
 * Como CBO é uma tabela global, não precisamos passar o tenantId.
 */
export async function getCbos(): Promise<Cbo[]> {
    try {
        const data = await apiFetch<Cbo[]>(ENDPOINT);
        return data;
    } catch (error) {
        console.error('Failed to fetch CBOs:', error);
        // Retorna um array vazio ou lança o erro, dependendo da necessidade da UI
        return [];
    }
}

/**
 * Busca um(a) Cbo específico(a) pelo ID.
 */
export async function getCboById(id: number): Promise<Cbo> {
    return apiFetch<Cbo>(`${ENDPOINT}/${id}`);
}

/**
 * Cria um(a) novo(a) Cbo.
 */
export async function createCbo(data: Omit<Cbo, 'id'>): Promise<Cbo> {
    return apiFetch<Cbo>(ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

/**
 * Atualiza um(a) Cbo existente.
 * @param id O ID do(a) Cbo a ser atualizado(a).
 * @param data Os dados a serem atualizados.
 */
export async function updateCbo(id: number, data: Partial<Omit<Cbo, 'id'>>): Promise<Cbo> {
    return apiFetch<Cbo>(`${ENDPOINT}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

/**
 * Deleta um(a) Cbo.
 * @param id O ID do(a) Cbo a ser deletado(a).
 */
export async function deleteCbo(id: number): Promise<void> {
    await apiFetch<void>(`${ENDPOINT}/${id}`, {
        method: 'DELETE',
    });
}
