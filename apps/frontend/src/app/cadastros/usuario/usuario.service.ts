// A base da URL da API deve vir de uma variável de ambiente
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const ENDPOINT = `/usuario`;

export type Usuario = {
    id: number;
    idColaborador: number;
    idPapel: number;
    login: string;
    senha: string;
    administrador: string;
    dataCadastro: string;
}

/**
 * Busca uma lista de Usuario.
 */
export async function getUsuarios(): Promise<Usuario[]> {
    const response = await fetch(`${API_URL}${ENDPOINT}`);
    if (!response.ok) {
        throw new Error('Falha ao buscar os dados de Usuario.');
    }
    return response.json();
}

/**
 * Busca um(a) Usuario específico(a) pelo ID.
 * @param id O ID do(a) Usuario.
 */
export async function getUsuarioById(id: number): Promise<Usuario> {
    const response = await fetch(`${API_URL}${ENDPOINT}/${id}`);
    if (!response.ok) {
        throw new Error('Falha ao buscar o dado de Usuario.');
    }
    return response.json();
}

/**
 * Cria um(a) novo(a) Usuario.
 * @param data Os dados para o(a) novo(a) Usuario.
 */
export async function createUsuario(data: Omit<Usuario, 'id'>): Promise<Usuario> {
    const response = await fetch(`${API_URL}${ENDPOINT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        // TODO: Melhorar o tratamento de erros com base no corpo da resposta
        throw new Error('Falha ao criar o dado de Usuario.');
    }
    return response.json();
}

/**
 * Atualiza um(a) Usuario existente.
 * @param id O ID do(a) Usuario a ser atualizado(a).
 * @param data Os dados a serem atualizados.
 */
export async function updateUsuario(id: number, data: Partial<Omit<Usuario, 'id'>>): Promise<Usuario> {
    const response = await fetch(`${API_URL}${ENDPOINT}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        // TODO: Melhorar o tratamento de erros com base no corpo da resposta
        throw new Error('Falha ao atualizar o dado de Usuario.');
    }
    return response.json();
}

/**
 * Deleta um(a) Usuario.
 * @param id O ID do(a) Usuario a ser deletado(a).
 */
export async function deleteUsuario(id: number): Promise<void> {
    const response = await fetch(`${API_URL}${ENDPOINT}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        // TODO: Melhorar o tratamento de erros com base no corpo da resposta
        throw new Error('Falha ao deletar o dado de Usuario.');
    }
}
