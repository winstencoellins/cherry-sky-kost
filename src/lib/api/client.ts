import { getClientApiBaseUrl } from "@/lib/api/base-url";
import { ApiError, networkError, parseApiError } from "@/lib/api/errors";
import { handleDeactivatedApiError } from "@/lib/auth/handle-api-auth-error";

export type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;

  const baseUrl = getClientApiBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  let response: Response;

  try {
    response = await fetch(url, {
      ...rest,
      credentials: "include",
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw networkError();
  }

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const error = parseApiError(response.status, payload);
    void handleDeactivatedApiError(error);
    throw error;
  }

  return payload as T;
}

export async function apiFetchOrThrow<T>(
  path: string,
  options?: ApiFetchOptions,
): Promise<T> {
  try {
    return await apiFetch<T>(path, options);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw networkError();
  }
}
