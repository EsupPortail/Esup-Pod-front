import { authFetch } from "./authFetch";
import { requestJson } from "@/src/utils/requestJson";

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type FetchOptions = RequestInit & {
  accessToken?: string | null;
  onRefresh?: () => Promise<string | null>;
};

export async function fetchAllPages<T>(
  initialUrl: string,
  options?: FetchOptions
): Promise<T[]> {
  let url: string | null = initialUrl;
  const allResults: T[] = [];

  while (url) {
    const res = await authFetch(url, options);
    
    // We expect either an array directly, or a DRF PaginatedResponse
    const data = await requestJson<T[] | PaginatedResponse<T>>(res);

    if (Array.isArray(data)) {
      allResults.push(...data);
      break;
    } else if (data && Array.isArray(data.results)) {
      allResults.push(...data.results);
      url = data.next || null;
    } else {
      break;
    }
  }

  return allResults;
}
