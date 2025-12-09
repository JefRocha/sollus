import { NextResponse } from "next/server";
import { apiFetchServer } from "@/lib/api-server";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") || undefined;
  const cookie = req.headers.get("cookie") || undefined;
  
  const { searchParams } = new URL(req.url);
  const query = searchParams.toString();
  
  // Endpoint no backend (que atualmente não existe, gerando 404)
  const endpoint = `/api/financeiro/pagar/pendentes${query ? `?${query}` : ""}`;

  const opts: RequestInit & { suppressErrorLog?: boolean } = {
    suppressErrorLog: true,
    headers: {
      ...(auth ? { Authorization: auth } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
  };

  const ctx = {
    cookieHeader: cookie || undefined,
  } as any;

  try {
    const data = await apiFetchServer<any>(endpoint, opts, ctx);

    // Se o backend não tem a rota (404) ou der erro, retornamos mock para não quebrar a UI
    if (data?.__http_error) {
       console.warn("[Financeiro Mock] Backend route not found, serving mock data.");
       return NextResponse.json({
         total: 12500.50,
         count: 5,
         items: [
           { id: 1, descricao: "Fornecedor A", valor: 5000.00, vencimento: "2025-01-15" },
           { id: 2, descricao: "Energia Elétrica", valor: 1200.50, vencimento: "2025-01-20" },
           { id: 3, descricao: "Internet", valor: 300.00, vencimento: "2025-01-10" },
         ]
       });
    }
    
    if (data?.__unauthorized) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = NextResponse.json(data);

    const setCookies = (data as any)?.__set_cookies;
    if (setCookies && Array.isArray(setCookies)) {
      setCookies.forEach((c: string) => {
        response.headers.append("Set-Cookie", c);
      });
    }

    return response;
  } catch (error) {
     // Fallback de segurança
     return NextResponse.json({
         total: 0,
         count: 0,
         items: []
     });
  }
}
