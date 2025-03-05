import { env } from "~/env";
import { ApiError } from "./client";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { RequestCookies } from "next/dist/server/web/spec-extension/cookies";

const defaultHeaders = {
  "Content-Type": "application/json",
};

type CookieContainer = {
  get(name: string): { value: string } | undefined;
};

function getAuthHeader(cookies: CookieContainer): string | undefined {
  try {
    const authToken = cookies.get('auth_token');
    if (authToken?.value) {
      return `Bearer ${authToken.value}`;
    }
  } catch (error) {
    console.warn('Failed to access cookies in server component:', error);
  }
  return undefined;
}

export async function serverApiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  cookies: ReadonlyRequestCookies | RequestCookies
): Promise<T> {
  const url = `${env.BACKEND_URL}${endpoint}`;
  
  // Create headers object with default headers
  const headers = new Headers();
  
  // Add default headers
  Object.entries(defaultHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });
  
  // Add custom headers from options
  if (options.headers) {
    const customHeaders = options.headers as Record<string, string>;
    Object.entries(customHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }

  const authHeader = getAuthHeader(cookies);
  if (authHeader) {
    headers.set('Authorization', authHeader);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);
  let data: unknown;
  
  try {
    data = await response.json();
  } catch {
    throw new ApiError(
      "Failed to parse response as JSON",
      response.status
    );
  }

  if (!response.ok) {
    const errorData = data as { message?: string; code?: string; details?: Record<string, string[]> };
    throw new ApiError(
      errorData.message ?? "An error occurred",
      response.status,
      errorData.code,
      errorData.details
    );
  }

  return data as T;
} 