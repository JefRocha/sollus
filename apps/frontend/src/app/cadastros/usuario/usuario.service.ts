import { apiFetch, isErrorResult } from '@/lib/api';
const ENDPOINT = `/usuario`;

export type Usuario = {
    id: number;
    idColaborador: number;
    idPapel: number;
    login: string;
    senha: string;
    administrador?: string;
    dataCadastro?: string;
}

/**
 * Busca uma lista de Usuario.
 */
export async function getUsuarios(): Promise<Usuario[]> {
    const r = await apiFetch<any>([ENDPOINT, '/usuarios', `/api${ENDPOINT}`, `/cadastros${ENDPOINT}`], { suppressErrorLog: true });
    if (isErrorResult(r)) return [];
    return Array.isArray(r) ? r : (Array.isArray(r?.data) ? r.data : (Array.isArray(r?.content) ? r.content : []));
}

/**
 * Busca um(a) Usuario específico(a) pelo ID.
 * @param id O ID do(a) Usuario.
 */
export async function getUsuarioById(id: number): Promise<Usuario> {
    const r = await apiFetch<Usuario>([`/usuario/${id}`, `/usuarios/${id}`, `/api/usuario/${id}`, `/cadastros/usuario/${id}`], { suppressErrorLog: true });
    return r;
}

/**
 * Cria um(a) novo(a) Usuario.
 * @param data Os dados para o(a) novo(a) Usuario.
 */
export async function createUsuario(data: Omit<Usuario, 'id'>): Promise<Usuario> {
    return apiFetch<Usuario>([ENDPOINT, '/usuarios', `/api${ENDPOINT}`, `/cadastros${ENDPOINT}`], { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), suppressErrorLog: true });
}

/**
 * Atualiza um(a) Usuario existente.
 * @param id O ID do(a) Usuario a ser atualizado(a).
 * @param data Os dados a serem atualizados.
 */
export async function updateUsuario(id: number, data: Partial<Omit<Usuario, 'id'>>): Promise<Usuario> {
    return apiFetch<Usuario>([`/usuario/${id}`, `/usuarios/${id}`, `/api/usuario/${id}`, `/cadastros/usuario/${id}`], { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), suppressErrorLog: true });
}

/**
 * Deleta um(a) Usuario.
 * @param id O ID do(a) Usuario a ser deletado(a).
 */
export async function deleteUsuario(id: number): Promise<void> {
    await apiFetch<void>([`/usuario/${id}`, `/usuarios/${id}`, `/api/usuario/${id}`, `/cadastros/usuario/${id}`], { method: 'DELETE', suppressErrorLog: true });
}
