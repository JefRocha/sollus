import "server-only";

const ENV_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
// Não forçar protocolo
const API_URL = ENV_API_URL;

if (process.env.NODE_ENV !== "production") {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  } catch {}
}

export async function apiFetchServer<T>(
  endpoint: string | string[],
  options?: RequestInit & { suppressErrorLog?: boolean },
  ctx?: {
    accessToken?: string;
    cookieHeader?: string;
    xsrfToken?: string;
    refreshToken?: string;
  }
): Promise<T> {
  const endpoints = Array.isArray(endpoint) ? endpoint : [endpoint];
  const { suppressErrorLog, ...fetchOptions } = options || ({} as any);
  const suppress = !!suppressErrorLog;
  let accessToken = ctx?.accessToken || undefined;
  let xsrfToken = ctx?.xsrfToken || undefined;
  let cookieHeader = ctx?.cookieHeader || "";
  const refreshToken = ctx?.refreshToken || undefined;

  for (const ep of endpoints) {
    const url = `${API_URL}${ep}`;
    try {
      const method = String(fetchOptions?.method || "GET").toUpperCase();
      let csrfHeader: Record<string, string> = {};
      if (/^(POST|PUT|PATCH|DELETE)$/.test(method)) {
        if (!xsrfToken) {
          try {
            const csrfRes = await fetch(`${API_URL}/api/csrf`, {
              credentials: "include",
              headers: { ...(cookieHeader ? { Cookie: cookieHeader } : {}) },
            }).catch(() => null);
            if (csrfRes && csrfRes.ok) {
              const text = await csrfRes.text().catch(() => "");
              try {
                const json = JSON.parse(text);
                xsrfToken = json?.token || json?.csrfToken || undefined;
              } catch {
                xsrfToken = text || undefined;
              }

              // CAPTURA O NOVO COOKIE XSRF-TOKEN E ATUALIZA O HEADER
              const newCookieHeader = csrfRes.headers.get("set-cookie");
              if (newCookieHeader) {
                const match = newCookieHeader.match(/XSRF-TOKEN=([^;]+)/);
                if (match) {
                  const newTokenCookie = `XSRF-TOKEN=${match[1]}`;
                  if (cookieHeader.includes("XSRF-TOKEN=")) {
                    cookieHeader = cookieHeader.replace(
                      /XSRF-TOKEN=[^;]+/,
                      newTokenCookie
                    );
                  } else {
                    cookieHeader = cookieHeader
                      ? `${cookieHeader}; ${newTokenCookie}`
                      : newTokenCookie;
                  }
                }
              }
            }
          } catch {}
        }
        if (xsrfToken) csrfHeader = { "X-CSRF-Token": xsrfToken };
      }

      const res = await fetch(url, {
        cache: "no-store",
        ...fetchOptions,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Connection: "close", // Evita erros de UND_ERR_SOCKET em Node v18+ (keep-alive race condition)
          ...(accessToken &&
          accessToken !== "undefined" &&
          accessToken !== "null"
            ? { Authorization: `Bearer ${accessToken}` }
            : {}),
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
          ...csrfHeader,
          ...fetchOptions?.headers,
        },
      });

      if (res.ok) return res.json();

      if (res.status === 401) {
        try {
          let refreshed = false;
          let newAccessToken: string | undefined;
          // Primeiro tenta refresh com body + CSRF
          if (refreshToken) {
            const r1 = await fetch(`${API_URL}/api/auth/refresh`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                ...(xsrfToken ? { "X-CSRF-Token": xsrfToken } : {}),
                ...(cookieHeader
                  ? { Cookie: cookieHeader }
                  : refreshToken
                  ? {
                      Cookie: `sollus_refresh_token=${refreshToken}${
                        xsrfToken ? `; XSRF-TOKEN=${xsrfToken}` : ""
                      }`,
                    }
                  : {}),
              },
              // Backend não lê body; mantemos vazio
            }).catch(() => null);
            if (r1 && r1.ok) {
              try {
                const json = await r1.json().catch(() => ({} as any));
                newAccessToken = json?.token || json?.accessToken || undefined;
                const newRefresh = json?.refreshToken || undefined;
                accessToken = newAccessToken || accessToken;
              } catch {}
              refreshed = true;
            }
          }

          // Fallback: tenta refresh só com cookies
          let refreshSetCookie: string[] = [];
          if (!refreshed) {
            const r2 = await fetch(`${API_URL}/api/auth/refresh`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                ...(xsrfToken ? { "X-CSRF-Token": xsrfToken } : {}),
                ...(cookieHeader
                  ? { Cookie: cookieHeader }
                  : refreshToken
                  ? {
                      Cookie: `sollus_refresh_token=${refreshToken}${
                        xsrfToken ? `; XSRF-TOKEN=${xsrfToken}` : ""
                      }`,
                    }
                  : {}),
              },
            }).catch(() => null);
            if (r2 && r2.ok) {
              refreshed = true;
              const setCookieHeader = r2.headers.get("set-cookie");
              if (setCookieHeader) {
                // Em Node.js fetch, set-cookie pode vir concatenado ou precisamos tratar.
                // A API Fetch standard retorna string única com vírgulas ou null.
                // Vamos tentar parsear simples.
                refreshSetCookie.push(setCookieHeader);
              }
            }
          }

          if (refreshed) {
            // Se tivemos refresh via cookie, precisamos atualizar o header Cookie para o retry
            let retryCookieHeader = cookieHeader;
            if (refreshSetCookie.length > 0) {
              // Extrair novos tokens dos cookies retornados
              // Simplificação: apenas anexa os novos cookies ao header existente,
              // pois o servidor geralmente pega o último valor ou o mais específico.
              // Uma abordagem mais robusta seria substituir os valores antigos.
              const newCookies = refreshSetCookie.join("; ");
              retryCookieHeader = retryCookieHeader
                ? `${retryCookieHeader}; ${newCookies}`
                : newCookies;
            }

            const retry = await fetch(url, {
              cache: "no-store",
              ...fetchOptions,
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                Connection: "close",
                ...(accessToken &&
                accessToken !== "undefined" &&
                accessToken !== "null"
                  ? { Authorization: `Bearer ${accessToken}` }
                  : {}),
                ...(xsrfToken ? { "X-CSRF-Token": xsrfToken } : {}),
                ...(retryCookieHeader ? { Cookie: retryCookieHeader } : {}),
                ...fetchOptions?.headers,
              },
            });

            // Se o retry funcionar, precisamos avisar o chamador sobre os novos cookies
            if (retry.ok) {
              const data = await retry.json();
              // Injetar metadados de cookie se houver renovação, para que o route handler possa repassar
              if (
                refreshSetCookie.length > 0 &&
                typeof data === "object" &&
                data !== null
              ) {
                (data as any).__set_cookies = refreshSetCookie;
              }
              return data;
            }
          }
        } catch (e) {
          if (e instanceof Error && e.message !== "Unauthorized") {
            if (!suppress) console.error("Refresh token failed (server):", e);
          }
        }
        return { __unauthorized: true } as any as T;
      }

      const bodyText = await res.text().catch(() => "");
      const msg = `API Error: ${res.status} ${res.statusText}${
        bodyText ? ` - ${bodyText}` : ""
      }`;
      if (!suppress)
        console.error("[API SERVER FETCH ERROR] Response not OK:", msg);
      return {
        __http_error: {
          status: res.status,
          statusText: res.statusText,
          body: bodyText,
        },
        message: msg,
      } as any as T;
    } catch (error: any) {
      const isAuthError =
        error instanceof Error &&
        (error.message === "Unauthorized" || /401/.test(String(error)));
      if (!suppress && !isAuthError)
        console.error("[API SERVER FETCH ERROR] Network issue:", error);
      continue;
    }
  }
  return {
    __http_error: { status: 0, statusText: "", body: null },
    message: "API Error: 0",
  } as any as T;
}
