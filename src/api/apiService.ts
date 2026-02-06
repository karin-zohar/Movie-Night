type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function apiRequest<TResponse = unknown>(
  baseUrl: string,
  method: HttpMethod,
  path: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<TResponse> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body && ["POST", "PUT", "PATCH"].includes(method)) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${baseUrl}${path}`, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API ${response.status}: ${text}`);
  }
  try {
    return (await response.json()) as TResponse;
  } catch (error) {
    console.error("API request failed:", error);
    return {} as TResponse;
  }
}
