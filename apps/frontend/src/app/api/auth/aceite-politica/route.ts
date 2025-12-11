import { NextResponse } from "next/server";
import { apiFetchServer } from "@/lib/api-server";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || undefined;
  const cookie = req.headers.get("cookie") || undefined;

  const opts: RequestInit & { suppressErrorLog?: boolean } = {
    method: "POST",
    suppressErrorLog: true,
    headers: {
      ...(auth ? { Authorization: auth } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...(req.headers.get("x-csrf-token")
        ? { "x-csrf-token": req.headers.get("x-csrf-token")! }
        : {}),
      ...(req.headers.get("X-CSRF-TOKEN")
        ? { "x-csrf-token": req.headers.get("X-CSRF-TOKEN")! }
        : {}),
    },
    body: "{}",
  };

  const csrfToken =
    req.headers.get("x-csrf-token") ||
    req.headers.get("X-CSRF-TOKEN") ||
    undefined;

  const ctx = {
    cookieHeader: cookie || undefined,
    xsrfToken: csrfToken || "skip",
  } as any;

  // Proxy para o backend real
  const result = await apiFetchServer<any>(
    "/api/auth/aceite-politica",
    opts,
    ctx
  );

  if (result?.__http_error) {
    // Tenta fallback para rota sem /api se falhar (dependendo da config do backend)
    const retry = await apiFetchServer<any>("/auth/aceite-politica", opts, ctx);
    if (!retry?.__http_error) {
      return handleSuccess(retry);
    }
    return NextResponse.json(
      { error: result.message || "Erro ao processar requisição" },
      { status: result.__http_error.status || 500 }
    );
  }

  if (result?.__unauthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return handleSuccess(result);
}

function handleSuccess(result: any) {
  const response = NextResponse.json(result);

  const setCookies = (result as any)?.__set_cookies;
  if (setCookies && Array.isArray(setCookies)) {
    setCookies.forEach((c: string) => {
      response.headers.append("Set-Cookie", c);
    });
  }

  return response;
}
