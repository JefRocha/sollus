import { apiClientFetch } from "@/lib/api-client";
import { Pessoa } from "@/actions/cadastros/pessoa-actions";

export async function updatePessoaClient(pessoa: Pessoa) {
  const res = await apiClientFetch<Pessoa>(`/api/pessoa/${pessoa.id}`, {
    method: "PUT",
    body: JSON.stringify(pessoa),
  });
  return res;
}

export async function createPessoaClient(pessoa: Pessoa) {
  const res = await apiClientFetch<Pessoa>(`/api/pessoa`, {
    method: "POST",
    body: JSON.stringify(pessoa),
  });
  return res;
}
