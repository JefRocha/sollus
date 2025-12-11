/* empty */

const ENV_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const SUPPRESS_CLIENT_API_LOGS =
  process.env.NEXT_PUBLIC_SUPPRESS_API_LOGS === "1";
// Garante localhost em vez de IP para evitar erro de certificado SSL
const API_URL = ENV_API_URL.replace("127.0.0.1", "localhost");

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
    if (typeof window !== "undefined") {
      accessToken = localStorage.getItem("sollus_access_token") || undefined;
    }
  } catch (e) {
    if (!SUPPRESS_CLIENT_API_LOGS) {
      console.warn(
        "Could not access localStorage or cookies for access token:",
        e
      );
    }
  }

  const { suppressErrorLog, ...fetchOptions } = options || ({} as any);
  const suppress = !!suppressErrorLog;

  let lastStatus = 0;
  let lastStatusText = "";
  let lastBody: string | null = null;

  for (const ep of endpoints) {
    const url = `${API_URL}${ep}`;
    if (!SUPPRESS_CLIENT_API_LOGS) {
      console.log(
        `[ApiFetch] Request: ${(
          fetchOptions?.method || "GET"
        ).toUpperCase()} ${url}`
      );
    }
    try {
      const method = String(fetchOptions?.method || "GET").toUpperCase();
      let csrfToken: string | undefined;
      // Só busca CSRF se NÃO tiver token de acesso, ou se backend exigir ambos (o que não é o caso aqui)
      if (
        !accessToken &&
        typeof window !== "undefined" &&
        process.env.NEXT_PUBLIC_ENABLE_CSRF === "1" &&
        /^(POST|PUT|PATCH|DELETE)$/.test(method)
      ) {
        try {
          csrfToken = localStorage.getItem("sollus_csrf_token") || undefined;
          if (!csrfToken) {
            const csrfRes = await fetch(`${API_URL}/api/csrf`, {
              credentials: "include",
            }).catch(() => null);
            if (csrfRes && csrfRes.ok) {
              const bodyText = await csrfRes.text().catch(() => "");
              try {
                const json = JSON.parse(bodyText);
                csrfToken = json?.token || json?.csrfToken || undefined;
              } catch {
                csrfToken = bodyText || undefined;
              }
              if (csrfToken) {
                try {
                  localStorage.setItem("sollus_csrf_token", csrfToken);
                } catch {}
              }
            }
          }
        } catch {}
      }
      const res = await fetch(url, {
        cache: "no-store",
        ...fetchOptions,
        credentials: "include",
        headers: {
          ...(method === "GET" || method === "HEAD"
            ? {}
            : { "Content-Type": "application/json" }),
          ...(accessToken &&
          accessToken !== "undefined" &&
          accessToken !== "null"
            ? { Authorization: `Bearer ${accessToken}` }
            : {}),
          ...(csrfToken && { "X-CSRF-Token": csrfToken }),
          ...fetchOptions?.headers,
        },
      });

      if (res.ok) {
        return res.json();
      }

      if (res.status === 401) {
        try {
          let refreshed = false;
          let newAccessToken: string | undefined;

          try {
            let refreshToken: string | undefined;
            if (typeof window !== "undefined") {
              refreshToken =
                localStorage.getItem("sollus_refresh_token") || undefined;
            }

            if (refreshToken) {
              let refreshCsrf: string | undefined;
              if (
                typeof window !== "undefined" &&
                process.env.NEXT_PUBLIC_ENABLE_CSRF === "1"
              ) {
                try {
                  refreshCsrf =
                    localStorage.getItem("sollus_csrf_token") || undefined;
                  if (!refreshCsrf) {
                    const csrfRes = await fetch(`${API_URL}/api/csrf`, {
                      credentials: "include",
                    }).catch(() => null);
                    if (csrfRes && csrfRes.ok) {
                      const bodyText = await csrfRes.text().catch(() => "");
                      try {
                        const json = JSON.parse(bodyText);
                        refreshCsrf =
                          json?.token || json?.csrfToken || undefined;
                      } catch {
                        refreshCsrf = bodyText || undefined;
                      }
                      if (refreshCsrf) {
                        try {
                          localStorage.setItem(
                            "sollus_csrf_token",
                            refreshCsrf
                          );
                        } catch {}
                      }
                    }
                  }
                } catch {}
              }
              const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...(refreshCsrf && { "X-CSRF-Token": refreshCsrf }),
                },
                body: JSON.stringify({ refreshToken }),
                credentials: "include",
              });
              if (refreshRes.ok) {
                try {
                  const json = await refreshRes.json().catch(() => ({} as any));
                  newAccessToken =
                    json?.token || json?.accessToken || undefined;
                  const newRefreshToken = json?.refreshToken || undefined;
                  if (typeof window !== "undefined") {
                    if (newAccessToken)
                      localStorage.setItem(
                        "sollus_access_token",
                        newAccessToken
                      );
                    if (newRefreshToken)
                      localStorage.setItem(
                        "sollus_refresh_token",
                        newRefreshToken
                      );
                  }
                } catch {}
                refreshed = true;
              }
            }
          } catch {}

          // Se não conseguiu via Bearer/localStorage, tenta refresh só com cookies httpOnly
          if (!refreshed) {
            let refreshCsrf: string | undefined;
            if (
              typeof window !== "undefined" &&
              process.env.NEXT_PUBLIC_ENABLE_CSRF === "1"
            ) {
              try {
                refreshCsrf =
                  localStorage.getItem("sollus_csrf_token") || undefined;
                if (!refreshCsrf) {
                  const csrfRes = await fetch(`${API_URL}/api/csrf`, {
                    credentials: "include",
                  }).catch(() => null);
                  if (csrfRes && csrfRes.ok) {
                    const bodyText = await csrfRes.text().catch(() => "");
                    try {
                      const json = JSON.parse(bodyText);
                      refreshCsrf = json?.token || json?.csrfToken || undefined;
                    } catch {
                      refreshCsrf = bodyText || undefined;
                    }
                    if (refreshCsrf) {
                      try {
                        localStorage.setItem("sollus_csrf_token", refreshCsrf);
                      } catch {}
                    }
                  }
                }
              } catch {}
            }
            const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                ...(refreshCsrf && { "X-CSRF-Token": refreshCsrf }),
              },
            }).catch(() => null);
            if (refreshRes && refreshRes.ok) {
              refreshed = true;
              try {
                const json = await refreshRes.json().catch(() => ({}));
                const newAccess = json?.token || json?.accessToken;
                const newRefresh = json?.refreshToken;
                if (newAccess) newAccessToken = newAccess; // Update local variable for retry
                if (typeof window !== "undefined") {
                  if (newAccess)
                    localStorage.setItem("sollus_access_token", newAccess);
                  if (newRefresh)
                    localStorage.setItem("sollus_refresh_token", newRefresh);
                }
              } catch {}
            }
          }

          if (refreshed) {
            const retryRes = await fetch(url, {
              ...fetchOptions,
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                ...(newAccessToken && {
                  Authorization: `Bearer ${newAccessToken}`,
                }),
                ...(csrfToken && { "X-CSRF-Token": csrfToken }),
                ...fetchOptions?.headers,
              },
            });
            if (retryRes.ok) {
              return retryRes.json();
            }
          }
        } catch (e) {
          if (e instanceof Error && e.message !== "Unauthorized") {
            if (!suppress && !SUPPRESS_CLIENT_API_LOGS)
              console.error("Refresh token failed:", e);
          }
        }
        return { __unauthorized: true } as any as T;
      }

      lastStatus = res.status;
      lastStatusText = res.statusText;
      lastBody = await res.text().catch(() => null);
      continue;
    } catch (error: any) {
      const isAuthError =
        error instanceof Error &&
        (error.message === "Unauthorized" || /401/.test(String(error)));
      if (!suppress && !isAuthError) {
        if (!SUPPRESS_CLIENT_API_LOGS)
          console.error(
            "[API FETCH ERROR] Network or other fetch issue:",
            error
          );
      }
      lastStatus = 0;
      lastStatusText = String(error?.message || error);
      lastBody = null;
      continue;
    }
  }

  const msg = `API Error: ${lastStatus} ${lastStatusText}${
    lastBody ? ` - ${lastBody}` : ""
  }`;
  if (!suppress && !SUPPRESS_CLIENT_API_LOGS) {
    console.error("[API FETCH ERROR] Response not OK:", msg);
  }
  return {
    __http_error: {
      status: lastStatus,
      statusText: lastStatusText,
      body: lastBody,
    },
    message: msg,
  } as any as T;
}
