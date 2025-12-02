import { apiFetch } from '@/lib/api';

const ENDPOINT = `/nivel-formacao`;

export type NivelFormacao = {
    id: number;
    nome: string;
    descricao?: string;
}

export async function getNivelFormacaoById(id: number): Promise<NivelFormacao | undefined> {
    try {
        return await apiFetch<NivelFormacao>(`${ENDPOINT}/${id}`);
    } catch (error) {
        console.error("Error fetching nivel-formacao:", error);
        return undefined;
    }
}

export async function createNivelFormacao(data: Omit<NivelFormacao, 'id'>): Promise<NivelFormacao> {
    return apiFetch<NivelFormacao>(ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateNivelFormacao(id: number, data: Partial<Omit<NivelFormacao, 'id'>>): Promise<NivelFormacao> {
    return apiFetch<NivelFormacao>(`${ENDPOINT}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}
