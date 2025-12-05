import { apiFetch, isErrorResult } from "@/lib/api";

export async function municipioGetById(id: number) {
  const r = await apiFetch<any>([
    `/municipio/${id}`,
    `/municipios/${id}`,
    `/api/municipio/${id}`,
    `/cadastros/municipio/${id}`,
  ], { suppressErrorLog: true });
  if (isErrorResult(r)) {
    return { id, nome: "", codigoIbge: 0, uf: "" };
  }
  return r;
}

export async function municipioCreate(payload: any) {
  return apiFetch<any>([
    `/municipio`,
    `/municipios`,
    `/api/municipio`,
    `/cadastros/municipio`,
  ], { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), suppressErrorLog: true });
}

export async function municipioUpdate(payload: any) {
  return apiFetch<any>([
    `/municipio/${payload.id}`,
    `/municipios/${payload.id}`,
    `/api/municipio/${payload.id}`,
    `/cadastros/municipio/${payload.id}`,
  ], { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), suppressErrorLog: true });
}
