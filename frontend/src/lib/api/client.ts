interface ApiClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
}

interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

type ApiResponse<T> = T | ApiErrorResponse;

export class ApiError extends Error {
  public readonly code?: string;
  public readonly details?: Record<string, string[]>;
  public readonly status: number;

  constructor(message: string, status: number, code?: string, details?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

const defaultConfig: ApiClientConfig = {
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
};

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${defaultConfig.baseURL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    credentials: "same-origin",
    headers: {
      ...defaultConfig.headers,
      ...(options.headers as Record<string, string>),
    },
  };

  const response = await fetch(url, config);
  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;
    throw new ApiError(
      errorData.message || "An error occurred",
      response.status,
      errorData.code,
      errorData.details
    );
  }

  return data as T;
}

// Helper function to check auth status without relying on cookies
export async function checkAuthStatus(): Promise<boolean> {
  try {
    await apiClient<{ authenticated: boolean }>("/api/v1/users/me");
    return true;
  } catch {
    return false;
  }
} 