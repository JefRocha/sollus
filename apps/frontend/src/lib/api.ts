import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Classe de erro customizada para erros de autenticação
class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit & { suppressErrorLog?: boolean }
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  // Obter o token de acesso (preferencialmente do localStorage para Client Components, fallback para cookies para Server Components)
  let accessToken: string | undefined;
  try {
    if (typeof window !== 'undefined') { // Client-side
      accessToken = localStorage.getItem("sollus_access_token") || undefined;
    } else { // Server-side
      const cookieStore = await cookies();
      accessToken = cookieStore.get("sollus_access_token")?.value || undefined;
    }
  } catch (e) {
    console.warn("Could not access localStorage or cookies for access token:", e);
  }


  try {
    const { suppressErrorLog, ...fetchOptions } = options || ({} as any);
    const suppress = !!suppressErrorLog;
    const res = await fetch(url, {
      ...fetchOptions,
      credentials: "include", // IMPORTANTE: envia cookies httpOnly (se houver)
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...fetchOptions?.headers,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        // Tenta renovar o token
        try {
          let refreshToken: string | undefined;
          if (typeof window !== 'undefined') { // Client-side
            refreshToken = localStorage.getItem("sollus_refresh_token") || undefined;
          } else { // Server-side
            const cookieStore = await cookies();
            refreshToken = cookieStore.get("sollus_refresh_token")?.value || undefined;
          }

          if (!refreshToken) {
            // Não há refresh token - usuário precisa fazer login novamente
            console.warn("No refresh token available. User needs to login again.");
            throw new Error("Unauthorized");
          }

          const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }), // Envia o refresh token no corpo
          });

          if (refreshRes.ok) {
            const { token: newAccessToken, refreshToken: newRefreshToken } = await refreshRes.json();

            if (newAccessToken && newRefreshToken) {
              // Armazena os novos tokens no localStorage (apenas para Client Components)
              // Nota: Server Components não podem definir cookies, apenas ler
              if (typeof window !== 'undefined') {
                localStorage.setItem("sollus_access_token", newAccessToken);
                localStorage.setItem("sollus_refresh_token", newRefreshToken);
              }


              // Tenta novamente a requisição original com o novo token
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
        } catch (e) {
          // Não logar erro se for apenas falta de autenticação
          if (e instanceof Error && e.message !== "Unauthorized") {
            console.error("Refresh token failed:", e);
          }
        }

        // Se chegou aqui, refresh falhou - lançar erro para redirecionar para login
        throw new Error("Unauthorized");
      }

      const errorBody = await res.text().catch(() => null);
      const errorMessage = `API Error: ${res.status} ${res.statusText}${errorBody ? ` - ${errorBody}` : ""
        }`;
      if (!suppress) {
        console.error("[API FETCH ERROR] Response not OK:", errorMessage);
      }
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    const suppress = !!(options as any)?.suppressErrorLog;
    // Não logar erros de autenticação como críticos
    const isAuthError = error instanceof Error && error.message === "Unauthorized";
    if (!suppress && !isAuthError) {
      console.error("[API FETCH ERROR] Network or other fetch issue:", error);
    }
    throw error; // Re-throw the error after logging
  }
}
