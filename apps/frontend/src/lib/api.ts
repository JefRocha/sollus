/* empty */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Classe de erro customizada para erros de autenticação
class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export function isErrorResult(x: any): boolean {
  return !!(x && (x.__error || x.__unauthorized || x.__http_error));
}

export async function apiFetch<T>(
  endpoint: string | string[],
  options?: RequestInit & { suppressErrorLog?: boolean }
): Promise<T> {
  const endpoints = Array.isArray(endpoint) ? endpoint : [endpoint];

  // Obter o token de acesso (preferencialmente do localStorage para Client Components, fallback para cookies para Server Components)
  let accessToken: string | undefined;
  try {
    if (typeof window !== 'undefined') {
      accessToken = localStorage.getItem("sollus_access_token") || undefined;
    }
  } catch (e) {
    console.warn("Could not access localStorage or cookies for access token:", e);
  }


  const { suppressErrorLog, ...fetchOptions } = options || ({} as any);
  const suppress = !!suppressErrorLog;

  let lastStatus = 0;
  let lastStatusText = "";
  let lastBody: string | null = null;

  for (const ep of endpoints) {
    const url = `${API_URL}${ep}`;
    try {
      const res = await fetch(url, {
        ...fetchOptions,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          ...fetchOptions?.headers,
        },
      });

      if (res.ok) {
        return res.json();
      }

      if (res.status === 401) {
        try {
          let refreshToken: string | undefined;
          if (typeof window !== 'undefined') {
            refreshToken = localStorage.getItem("sollus_refresh_token") || undefined;
          }

          if (refreshToken) {
            const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            });
            if (refreshRes.ok) {
              const { token: newAccessToken, refreshToken: newRefreshToken } = await refreshRes.json();
              if (newAccessToken && newRefreshToken) {
                if (typeof window !== 'undefined') {
                  localStorage.setItem("sollus_access_token", newAccessToken);
                  localStorage.setItem("sollus_refresh_token", newRefreshToken);
                }
                const retryRes = await fetch(url, {
                  ...fetchOptions,
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${newAccessToken}`,
                    ...fetchOptions?.headers,
                  },
                });
                if (retryRes.ok) {
                  return retryRes.json();
                }
              }
            }
          }
        } catch (e) {
          if (e instanceof Error && e.message !== "Unauthorized") {
            if (!suppress) console.error("Refresh token failed:", e);
          }
        }
        return { __unauthorized: true } as any as T;
      }

      lastStatus = res.status;
      lastStatusText = res.statusText;
      lastBody = await res.text().catch(() => null);
      continue;
    } catch (error: any) {
      const isAuthError = error instanceof Error && (error.message === "Unauthorized" || /401/.test(String(error)));
      if (!suppress && !isAuthError) {
        console.error("[API FETCH ERROR] Network or other fetch issue:", error);
      }
      lastStatus = 0;
      lastStatusText = String(error?.message || error);
      lastBody = null;
      continue;
    }
  }

  const msg = `API Error: ${lastStatus} ${lastStatusText}${lastBody ? ` - ${lastBody}` : ""}`;
  if (!suppress) {
    console.error("[API FETCH ERROR] Response not OK:", msg);
  }
  return { __http_error: { status: lastStatus, statusText: lastStatusText, body: lastBody }, message: msg } as any as T;
}
