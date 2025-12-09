import { NextResponse } from "next/server";
import { apiFetchServer } from "@/lib/api-server";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") || undefined;
  const cookie = req.headers.get("cookie") || undefined;
  const opts: RequestInit & { suppressErrorLog?: boolean } = {
    suppressErrorLog: false,
    headers: {
      ...(auth ? { Authorization: auth } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
  };
  const ctx = {
    cookieHeader: cookie || undefined,
  } as any;
  const tryPaths = async () => {
    for (const p of ["/api/auth/me", "/api/usuario/me", "/api/me"]) {
      try {
        const u = await apiFetchServer<any>(p, opts, ctx);
        return u;
      } catch {}
    }
    return null;
  };
  const base = await tryPaths();
  if (!base) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const name =
    base?.colaborador?.pessoa?.nome ||
    base?.nome ||
    base?.name ||
    base?.data?.nome ||
    base?.data?.name ||
    undefined;
  const email =
    base?.colaborador?.pessoa?.email ||
    base?.email ||
    base?.data?.email ||
    undefined;
  let roles = Array.isArray(base?.roles)
    ? base.roles
    : Array.isArray(base?.data?.roles)
    ? base.data.roles
    : undefined;
  const admRaw = base?.administrador ?? base?.data?.administrador;
  const admStr = typeof admRaw === "string" ? admRaw : admRaw ? "S" : undefined;
  const admNorm = admStr ? String(admStr).toUpperCase() : undefined;
  const administrador =
    admNorm &&
    (admNorm === "S" ||
      admNorm === "Y" ||
      admNorm === "TRUE" ||
      admNorm === "1")
      ? "S"
      : roles && roles.includes("ADMIN")
      ? "S"
      : undefined;
  if (administrador === "S") {
    roles = Array.isArray(roles) ? roles : [];
    if (!roles.includes("ADMIN")) roles.push("ADMIN");
  }
  const idColaborador =
    base?.idColaborador ??
    base?.data?.idColaborador ??
    base?.colaborador?.id ??
    base?.colaboradorId;
  const idPessoa =
    base?.idPessoa ??
    base?.data?.idPessoa ??
    base?.colaborador?.pessoa?.id ??
    base?.pessoaId;
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
    dataAceitePolitica:
      base?.dataAceitePolitica ||
      base?.data_aceite_politica ||
      base?.data?.dataAceitePolitica ||
      base?.data?.data_aceite_politica,
    raw: base,
  };

  const response = NextResponse.json(normalized);

  // Propagar cookies de refresh se houver
  const setCookies = (base as any)?.__set_cookies;
  if (setCookies && Array.isArray(setCookies)) {
    setCookies.forEach((c: string) => {
      response.headers.append("Set-Cookie", c);
    });
  }

  return response;
}
