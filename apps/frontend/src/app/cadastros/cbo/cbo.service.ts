// A base da URL da API deve vir de uma variável de ambiente
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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
 */
export async function getCbos(): Promise<Cbo[]> {
    const response = await fetch(`${API_URL}${ENDPOINT}`);
    if (!response.ok) {
        throw new Error('Falha ao buscar os dados de Cbo.');
    }
    return response.json();
}

/**
 * Busca um(a) Cbo específico(a) pelo ID.
 * @param id O ID do(a) Cbo.
 */
export async function getCboById(id: number): Promise<Cbo> {
    const response = await fetch(`${API_URL}${ENDPOINT}/${id}`);
    if (!response.ok) {
        throw new Error('Falha ao buscar o dado de Cbo.');
    }
    return response.json();
}

/**
 * Cria um(a) novo(a) Cbo.
 * @param data Os dados para o(a) novo(a) Cbo.
 */
export async function createCbo(data: Omit<Cbo, 'id'>): Promise<Cbo> {
    const response = await fetch(`${API_URL}${ENDPOINT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        // TODO: Melhorar o tratamento de erros com base no corpo da resposta
        throw new Error('Falha ao criar o dado de Cbo.');
    }
    return response.json();
}

/**
 * Atualiza um(a) Cbo existente.
 * @param id O ID do(a) Cbo a ser atualizado(a).
 * @param data Os dados a serem atualizados.
 */
export async function updateCbo(id: number, data: Partial<Omit<Cbo, 'id'>>): Promise<Cbo> {
    const response = await fetch(`${API_URL}${ENDPOINT}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        // TODO: Melhorar o tratamento de erros com base no corpo da resposta
        throw new Error('Falha ao atualizar o dado de Cbo.');
    }
    return response.json();
}

/**
 * Deleta um(a) Cbo.
 * @param id O ID do(a) Cbo a ser deletado(a).
 */
export async function deleteCbo(id: number): Promise<void> {
    const response = await fetch(`${API_URL}${ENDPOINT}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        // TODO: Melhorar o tratamento de erros com base no corpo da resposta
        throw new Error('Falha ao deletar o dado de Cbo.');
    }
}
