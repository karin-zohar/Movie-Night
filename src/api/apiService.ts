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
    const error = new Error(text);
    (error as Error & { status: number }).status = response.status;
    throw error;
  }
  try {
    return (await response.json()) as TResponse;
  } catch (error) {
    throw new Error(`Failed to parse JSON from ${method} ${baseUrl}${path}: ${error}`);
  }
}
