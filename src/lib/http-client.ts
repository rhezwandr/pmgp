export async function readJsonResponse<T extends Record<string, unknown>>(
  response: Response,
  fallbackError: string
): Promise<T & { error?: string }> {
  const text = await response.text();
  if (!text.trim()) {
    return { error: fallbackError } as T & { error: string };
  }

  try {
    return JSON.parse(text) as T & { error?: string };
  } catch {
    return { error: fallbackError } as T & { error: string };
  }
}

export const jsonFetchHeaders = {
  "Content-Type": "application/json"
};
