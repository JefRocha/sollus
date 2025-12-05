const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function apiClientFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  // Obter o token de acesso do localStorage (client-side)
  let accessToken: string | undefined;
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem("sollus_access_token") || undefined;
  }

  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...(options?.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(
      `API Error: ${res.status} ${res.statusText}${errorText ? ` - ${errorText}` : ""
      }`
    );
  }
  return res.json();
}
