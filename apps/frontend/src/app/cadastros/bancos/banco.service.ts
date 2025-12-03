import { apiFetch } from '@/lib/api';
import { BancoSchema } from './banco.zod.schema';

const ENDPOINT = `/banco`;

export async function getBancoById(id: number): Promise<BancoSchema | undefined> {
    try {
        return await apiFetch<BancoSchema>(`${ENDPOINT}/${id}`);
    } catch (error) {
        console.error("Error fetching banco:", error);
        return undefined;
    }
}

export async function createBanco(data: Omit<BancoSchema, 'id'>): Promise<BancoSchema> {
    return apiFetch<BancoSchema>(ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateBanco(id: number, data: Partial<Omit<BancoSchema, 'id'>>): Promise<BancoSchema> {
    return apiFetch<BancoSchema>(`${ENDPOINT}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteBanco(id: number): Promise<void> {
    return apiFetch<void>(`${ENDPOINT}/${id}`, {
        method: 'DELETE',
    });
}
