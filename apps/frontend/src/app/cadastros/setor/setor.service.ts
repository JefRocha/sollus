import { apiFetch, isErrorResult } from '@/lib/api';

const ENDPOINT = `/setor`;

export type Setor = {
    id: number;
    nome: string;
    descricao?: string;
}

export async function getSetorById(id: number): Promise<Setor | undefined> {
    const r = await apiFetch<any>([`/setor/${id}`, `/setores/${id}`, `/api/setor/${id}`, `/cadastros/setor/${id}`], { suppressErrorLog: true });
    if (isErrorResult(r)) return undefined;
    return r;
}

export async function createSetor(data: Omit<Setor, 'id'>): Promise<Setor> {
    return apiFetch<Setor>([ENDPOINT, '/setores', `/api${ENDPOINT}`, `/cadastros${ENDPOINT}`], {
        method: 'POST',
        body: JSON.stringify(data),
        suppressErrorLog: true,
    });
}

export async function updateSetor(id: number, data: Partial<Omit<Setor, 'id'>>): Promise<Setor> {
    return apiFetch<Setor>([`${ENDPOINT}/${id}`, `/setores/${id}`, `/api${ENDPOINT}/${id}`, `/cadastros${ENDPOINT}/${id}`], {
        method: 'PUT',
        body: JSON.stringify(data),
        suppressErrorLog: true,
    });
}
