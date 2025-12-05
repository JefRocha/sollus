import 'server-only';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:4000";

if (process.env.NODE_ENV !== 'production') {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  } catch {}
}

export async function apiFetchServer<T>(
  endpoint: string | string[],
  options?: RequestInit & { suppressErrorLog?: boolean },
  ctx?: { accessToken?: string; cookieHeader?: string; xsrfToken?: string; refreshToken?: string }
): Promise<T> {
  const endpoints = Array.isArray(endpoint) ? endpoint : [endpoint];
  const { suppressErrorLog, ...fetchOptions } = options || ({} as any);
  const suppress = !!suppressErrorLog;
  let accessToken = ctx?.accessToken || undefined;
  let xsrfToken = ctx?.xsrfToken || undefined;
  const cookieHeader = ctx?.cookieHeader || '';
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
              // Mantém em memória; o caller decide persistir se necessário
            }
          } catch {}
        }
        if (xsrfToken) csrfHeader = { "X-CSRF-Token": xsrfToken };
      }

      const res = await fetch(url, {
        ...fetchOptions,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
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
                  ? { Cookie: `sollus_refresh_token=${refreshToken}${xsrfToken ? `; XSRF-TOKEN=${xsrfToken}` : ""}` }
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
                  ? { Cookie: `sollus_refresh_token=${refreshToken}${xsrfToken ? `; XSRF-TOKEN=${xsrfToken}` : ""}` }
                  : {}),
              },
            }).catch(() => null);
            if (r2 && r2.ok) refreshed = true;
          }

          if (refreshed) {
            const retry = await fetch(url, {
              ...fetchOptions,
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                ...(xsrfToken ? { "X-CSRF-Token": xsrfToken } : {}),
              ...fetchOptions?.headers,
              },
            });
            if (retry.ok) return retry.json();
          }
        } catch (e) {
          if (e instanceof Error && e.message !== "Unauthorized") {
            if (!suppress) console.error("Refresh token failed (server):", e);
          }
        }
        return { __unauthorized: true } as any as T;
      }

      const bodyText = await res.text().catch(() => "");
      const msg = `API Error: ${res.status} ${res.statusText}${bodyText ? ` - ${bodyText}` : ""}`;
      if (!suppress) console.error("[API SERVER FETCH ERROR] Response not OK:", msg);
      return { __http_error: { status: res.status, statusText: res.statusText, body: bodyText }, message: msg } as any as T;
    } catch (error: any) {
      const isAuthError = error instanceof Error && (error.message === "Unauthorized" || /401/.test(String(error)));
      if (!suppress && !isAuthError) console.error("[API SERVER FETCH ERROR] Network issue:", error);
      continue;
    }
  }
  return { __http_error: { status: 0, statusText: "", body: null }, message: "API Error: 0" } as any as T;
}
