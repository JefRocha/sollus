import { apiFetch } from '@/lib/api';

const ENDPOINT = `/cargo`;

export type Cargo = {
    id: number;
    nome: string;
    descricao: string;
    salario: number;
    cbo1994: string;
    cbo2002: string;
}

/**
 * Busca uma lista de Cargo.
 */
export async function getCargos(): Promise<Cargo[]> {
    try {
        return await apiFetch<Cargo[]>(ENDPOINT);
    } catch (error) {
        console.error('Failed to fetch Cargos:', error);
        return [];
    }
}

/**
 * Busca um(a) Cargo específico(a) pelo ID.
 * @param id O ID do(a) Cargo.
 */
export async function getCargoById(id: number): Promise<Cargo> {
    return apiFetch<Cargo>(`${ENDPOINT}/${id}`);
}

/**
 * Cria um(a) novo(a) Cargo.
 * @param data Os dados para o(a) novo(a) Cargo.
 */
export async function createCargo(data: Omit<Cargo, 'id'>): Promise<Cargo> {
    return apiFetch<Cargo>(ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

/**
 * Atualiza um(a) Cargo existente.
 * @param id O ID do(a) Cargo a ser atualizado(a).
 * @param data Os dados a serem atualizados.
 */
export async function updateCargo(id: number, data: Partial<Omit<Cargo, 'id'>>): Promise<Cargo> {
    return apiFetch<Cargo>(`${ENDPOINT}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

/**
 * Deleta um(a) Cargo.
 * @param id O ID do(a) Cargo a ser deletado(a).
 */
export async function deleteCargo(id: number): Promise<void> {
    await apiFetch<void>(`${ENDPOINT}/${id}`, {
        method: 'DELETE',
    });
}
