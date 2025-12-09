import { apiServerAction } from "@/lib/api-server-action";
import { BancoSchema } from "./banco.zod.schema";

const ENDPOINT = "/api/bancos"; // Ajuste conforme a rota real do backend (provavelmente /api/banco ou /api/bancos)

// No backend, o controller é @Controller('banco') -> /api/banco
const REAL_ENDPOINT = "/api/banco"; 

export async function createBancoServer(data: Omit<BancoSchema, 'id'>): Promise<BancoSchema> {
    return apiServerAction<BancoSchema>(REAL_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateBancoServer(id: number, data: Partial<Omit<BancoSchema, 'id'>>): Promise<BancoSchema> {
    return apiServerAction<BancoSchema>(`${REAL_ENDPOINT}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteBancoServer(id: number): Promise<void> {
    return apiServerAction<void>(`${REAL_ENDPOINT}/${id}`, {
        method: "DELETE",
    });
}

export async function getBancoByIdServer(id: number): Promise<BancoSchema> {
    return apiServerAction<BancoSchema>(`${REAL_ENDPOINT}/${id}`);
}
