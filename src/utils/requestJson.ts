import { getClientLocale } from "@/src/i18n/client";

// Returns a Promise
// input: url/object/response
// Init: fetch options
/** Fetches a JSON response and raises an error for unsuccessful responses. */
export const requestJson = async <T>(
  input: RequestInfo | Response,
  init?: RequestInit | null,
): Promise<T> => {
  // If input is already a Response, we use it directly.
  const requestInit =
    input instanceof Response
      ? undefined
      : {
          ...init,
          headers: new Headers(
            init?.headers ??
              (input instanceof Request ? input.headers : undefined),
          ),
        };

  if (requestInit) {
    requestInit.headers.set("Accept-Language", getClientLocale());
  }

  const res = input instanceof Response ? input : await fetch(input, requestInit);
  if (!res.ok) {
    let message = "Erreur API.";
    try {
      const data = await res.json();
      if (typeof data?.detail === "string") {
        message = data.detail;
      } else if (typeof data?.error === "string") {
        message = data.error;
      }
    } catch {}
    throw new Error(message);
  }
  return res.json() as Promise<T>;
};
