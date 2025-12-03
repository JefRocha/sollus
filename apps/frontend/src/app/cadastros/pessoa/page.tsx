import { getPessoas } from "@/actions/cadastros/pessoa-actions"
import { PessoaListClient } from "./_components/pessoa-list-client"

export default async function PessoaPage() {
  const result = await getPessoas({})
  const data = result.pessoas || []

  return <PessoaListClient data={data} />
}
