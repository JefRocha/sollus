// A base da URL da API deve vir de uma variável de ambiente
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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
    const response = await fetch(`${API_URL}${ENDPOINT}`);
    if (!response.ok) {
        throw new Error('Falha ao buscar os dados de Cargo.');
    }
    return response.json();
}

/**
 * Busca um(a) Cargo específico(a) pelo ID.
 * @param id O ID do(a) Cargo.
 */
export async function getCargoById(id: number): Promise<Cargo> {
    const response = await fetch(`${API_URL}${ENDPOINT}/${id}`);
    if (!response.ok) {
        throw new Error('Falha ao buscar o dado de Cargo.');
    }
    return response.json();
}

/**
 * Cria um(a) novo(a) Cargo.
 * @param data Os dados para o(a) novo(a) Cargo.
 */
export async function createCargo(data: Omit<Cargo, 'id'>): Promise<Cargo> {
    const response = await fetch(`${API_URL}${ENDPOINT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        // TODO: Melhorar o tratamento de erros com base no corpo da resposta
        throw new Error('Falha ao criar o dado de Cargo.');
    }
    return response.json();
}

/**
 * Atualiza um(a) Cargo existente.
 * @param id O ID do(a) Cargo a ser atualizado(a).
 * @param data Os dados a serem atualizados.
 */
export async function updateCargo(id: number, data: Partial<Omit<Cargo, 'id'>>): Promise<Cargo> {
    const response = await fetch(`${API_URL}${ENDPOINT}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        // TODO: Melhorar o tratamento de erros com base no corpo da resposta
        throw new Error('Falha ao atualizar o dado de Cargo.');
    }
    return response.json();
}

/**
 * Deleta um(a) Cargo.
 * @param id O ID do(a) Cargo a ser deletado(a).
 */
export async function deleteCargo(id: number): Promise<void> {
    const response = await fetch(`${API_URL}${ENDPOINT}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        // TODO: Melhorar o tratamento de erros com base no corpo da resposta
        throw new Error('Falha ao deletar o dado de Cargo.');
    }
}
