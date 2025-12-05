import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function GET() {
  const tryPaths = async () => {
    for (const p of ["/auth/me", "/usuario/me", "/me"]) {
      try {
        const u = await apiFetch<any>(p, { suppressErrorLog: true });
        return u;
      } catch {}
    }
    return null;
  };
  const base = await tryPaths();
  if (!base) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const personName =
    base?.pessoaModel?.nome ||
    base?.colaboradorModel?.pessoaModel?.nome ||
    base?.data?.pessoaModel?.nome ||
    undefined;
  const personEmail =
    base?.pessoaModel?.email || base?.data?.pessoaModel?.email || base?.email || base?.data?.email;
  const name = personName || base?.nome || base?.name || base?.data?.nome || base?.data?.name;
  const email = personEmail || base?.email || base?.data?.email;
  const roles = Array.isArray(base?.roles)
    ? base.roles
    : Array.isArray(base?.data?.roles)
    ? base.data.roles
    : undefined;
  const administrador =
    base?.administrador ?? (roles && roles.includes("ADMIN") ? "S" : undefined);
  const idColaborador = base?.idColaborador ?? base?.data?.idColaborador ?? base?.colaboradorId;
  const idPessoa = base?.idPessoa ?? base?.data?.idPessoa ?? base?.pessoaId;
  const login = base?.login ?? base?.data?.login ?? base?.username;
  const displayName = name || (email ? String(email).split("@")[0] : login);

  const normalized = {
    id: base?.id ?? base?.data?.id,
    idColaborador,
    idPessoa,
    administrador,
    roles,
    name,
    email,
    displayName,
    raw: base,
  };

  return NextResponse.json(normalized);
}
