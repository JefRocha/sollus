import { apiFetch, isErrorResult } from '@/lib/api';
import { BancoSchema } from './banco.zod.schema';

const ENDPOINT = `/banco`;

export async function getBancoById(id: number): Promise<BancoSchema | undefined> {
    const data = await apiFetch<BancoSchema>([
        `${ENDPOINT}/${id}`,
        `/bancos/${id}`,
        `/api${ENDPOINT}/${id}`,
        `/cadastros${ENDPOINT}/${id}`,
    ], { suppressErrorLog: true });
    if (isErrorResult(data)) {
        return undefined;
    }
    return data;
}

export async function createBanco(data: Omit<BancoSchema, 'id'>): Promise<BancoSchema> {
    const res = await apiFetch<BancoSchema>([
        ENDPOINT,
        `/bancos`,
        `/api${ENDPOINT}`,
        `/cadastros${ENDPOINT}`,
    ], {
        method: 'POST',
        body: JSON.stringify(data),
        suppressErrorLog: true,
    });
    if (isErrorResult(res)) throw new Error('Erro ao criar banco');
    return res;
}

export async function updateBanco(id: number, data: Partial<Omit<BancoSchema, 'id'>>): Promise<BancoSchema> {
    const res = await apiFetch<BancoSchema>([
        `${ENDPOINT}/${id}`,
        `/bancos/${id}`,
        `/api${ENDPOINT}/${id}`,
        `/cadastros${ENDPOINT}/${id}`,
    ], {
        method: 'PUT',
        body: JSON.stringify(data),
        suppressErrorLog: true,
    });
    if (isErrorResult(res)) throw new Error('Erro ao atualizar banco');
    return res;
}

export async function deleteBanco(id: number): Promise<void> {
    await apiFetch<void>([
        `${ENDPOINT}/${id}`,
        `/bancos/${id}`,
        `/api${ENDPOINT}/${id}`,
        `/cadastros${ENDPOINT}/${id}`,
    ], {
        method: 'DELETE',
        suppressErrorLog: true,
    });
}
