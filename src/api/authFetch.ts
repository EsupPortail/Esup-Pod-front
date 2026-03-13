"use client";

type AuthFetchOptions = RequestInit & {
  accessToken?: string | null;
  onRefresh?: () => Promise<string | null>;
};

// Injecte automatiquement le header Authorization Bearer <token> dans chaque appel API protégé.

export async function authFetch(
  input: RequestInfo,
  { accessToken, onRefresh, headers, ...init }: AuthFetchOptions = {},
) {
  const makeRequest = (token?: string | null) => {
    const mergedHeaders = new Headers(headers);
    if (token) {
      mergedHeaders.set("Authorization", `Bearer ${token}`);
    }
    return fetch(input, { ...init, headers: mergedHeaders });
  };

  const res = await makeRequest(accessToken);
  if (res.status !== 401 || !onRefresh) {
    return res;
  }

  const newToken = await onRefresh();
  if (!newToken) {
    return res;
  }

  return makeRequest(newToken);
}
