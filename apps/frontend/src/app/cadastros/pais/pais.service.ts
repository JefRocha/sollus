import { apiServerAction } from "@/lib/api-server-action";

export async function getPaiss() {
  return apiServerAction("/api/pais");
}

export async function getPaisById(id: number) {
  return apiServerAction(`/api/pais/${id}`);
}
