import { apiFetch } from '@/lib/api';

const ENDPOINT = `/setor`;

export type Setor = {
    id: number;
    nome: string;
    descricao?: string;
}

export async function getSetorById(id: number): Promise<Setor | undefined> {
    try {
        return await apiFetch<Setor>(`${ENDPOINT}/${id}`);
    } catch (error) {
        console.error("Error fetching setor:", error);
        return undefined;
    }
}

export async function createSetor(data: Omit<Setor, 'id'>): Promise<Setor> {
    return apiFetch<Setor>(ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateSetor(id: number, data: Partial<Omit<Setor, 'id'>>): Promise<Setor> {
    return apiFetch<Setor>(`${ENDPOINT}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}
