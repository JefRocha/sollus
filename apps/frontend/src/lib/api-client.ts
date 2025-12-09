const USE_PROXY = false; // Proxy desativado
const ENV_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
// Garante localhost em vez de IP para evitar erro de certificado SSL
const API_URL = ENV_API_URL.replace("127.0.0.1", "localhost");
const COOKIE_ONLY = process.env.NEXT_PUBLIC_AUTH_COOKIE_ONLY === "1";

export async function apiClientFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = USE_PROXY
    ? `${API_URL}${endpoint.replace(/^\/api/, "")}`
    : `${API_URL}${endpoint}`;

  // Obter o token de acesso do localStorage (client-side)
  let accessToken: string | undefined;
  if (!COOKIE_ONLY && typeof window !== "undefined") {
    accessToken = localStorage.getItem("sollus_access_token") || undefined;
    if (!accessToken)
      console.warn("[ApiClient] No access token found in localStorage");
  }

  const method = String(options?.method || "GET").toUpperCase();
  let csrfToken: string | undefined;
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_ENABLE_CSRF === "1" &&
    /^(POST|PUT|PATCH|DELETE)$/.test(method)
  ) {
    try {
      csrfToken = localStorage.getItem("sollus_csrf_token") || undefined;
      if (!csrfToken) {
        const csrfUrl = USE_PROXY ? `${API_URL}/csrf` : `${API_URL}/api/csrf`;
        const csrfRes = await fetch(csrfUrl, {
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
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(!COOKIE_ONLY &&
      accessToken &&
      accessToken !== "undefined" &&
      accessToken !== "null"
        ? { Authorization: `Bearer ${accessToken}` }
        : {}),
      ...(csrfToken && { "X-CSRF-Token": csrfToken }),
      ...(options?.headers || {}),
    },
    ...options,
  });
  if (res.ok) {
    return res.json();
  }

  if (res.status === 401) {
    try {
      let refreshed = false;
      let refreshCsrf: string | undefined = csrfToken;
      if (
        !refreshCsrf &&
        typeof window !== "undefined" &&
        process.env.NEXT_PUBLIC_ENABLE_CSRF === "1"
      ) {
        try {
          refreshCsrf = localStorage.getItem("sollus_csrf_token") || undefined;
          if (!refreshCsrf) {
            const csrfUrl = USE_PROXY
              ? `${API_URL}/csrf`
              : `${API_URL}/api/csrf`;
            const csrfRes = await fetch(csrfUrl, {
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

      // Tentar refresh via body (localStorage refreshToken), depois fallback para cookies httpOnly
      try {
        const rt =
          !COOKIE_ONLY && typeof window !== "undefined"
            ? localStorage.getItem("sollus_refresh_token") || undefined
            : undefined;
        if (rt) {
          const refreshUrl = USE_PROXY
            ? `${API_URL}/auth/refresh`
            : `${API_URL}/api/auth/refresh`;
          const refreshResBody = await fetch(refreshUrl, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...(refreshCsrf && { "X-CSRF-Token": refreshCsrf }),
            },
            body: JSON.stringify({ refreshToken: rt }),
          }).catch(() => null);
          if (refreshResBody && refreshResBody.ok) {
            try {
              const body = await refreshResBody.json().catch(() => ({} as any));
              const newAccess = body?.token || body?.accessToken;
              const newRefresh = body?.refreshToken;
              if (!COOKIE_ONLY && typeof window !== "undefined") {
                if (newAccess)
                  localStorage.setItem("sollus_access_token", newAccess);
                if (newRefresh)
                  localStorage.setItem("sollus_refresh_token", newRefresh);
              }
            } catch {}
            refreshed = true;
          }
        }
      } catch {}

      if (!refreshed) {
        const refreshUrl = USE_PROXY
          ? `${API_URL}/auth/refresh`
          : `${API_URL}/api/auth/refresh`;
        const refreshRes = await fetch(refreshUrl, {
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
            const body = await refreshRes.json().catch(() => ({}));
            const newAccess = body?.token || body?.accessToken;
            const newRefresh = body?.refreshToken;
            if (!COOKIE_ONLY && typeof window !== "undefined") {
              if (newAccess)
                localStorage.setItem("sollus_access_token", newAccess);
              if (newRefresh)
                localStorage.setItem("sollus_refresh_token", newRefresh);
            }
          } catch {}
        }
      }

      if (refreshed) {
        // Reexecutar a requisição original
        const retryRes = await fetch(url, {
          cache: "no-store",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(!COOKIE_ONLY &&
            typeof window !== "undefined" &&
            localStorage.getItem("sollus_access_token")
              ? {
                  Authorization: `Bearer ${localStorage.getItem(
                    "sollus_access_token"
                  )}`,
                }
              : {}),
            ...(csrfToken && { "X-CSRF-Token": csrfToken }),
            ...(options?.headers || {}),
          },
          ...options,
        });
        if (retryRes.ok) {
          return retryRes.json();
        }
      }
    } catch {}
  }

  const errorText = await res.text().catch(() => "");
  throw new Error(
    `API Error: ${res.status} ${res.statusText}${
      errorText ? ` - ${errorText}` : ""
    }`
  );
}
