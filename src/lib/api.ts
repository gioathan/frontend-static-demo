import type { ApiErrorBody } from "@/types/api";
import { resolveMock } from "./mock-backend";

export class ApiError extends Error {
  status: number;
  code: string;
  details?: Record<string, unknown>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message || body.code);
    this.status = status;
    this.code = body.code;
    this.details = body.details;
  }
}

/**
 * STATIC DEMO BUILD: this no longer calls a real FastAPI backend. Every
 * call is resolved in-memory against the fixtures in `mock-data.ts` /
 * `mock-backend.ts`, so this copy of the app has no database or network
 * dependency. The function signatures are unchanged so every page/component
 * that calls `backendFetch` / `apiFetch` / `adminApiFetch` works untouched.
 */
async function mockRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const result = resolveMock(init?.method ?? "GET", path, init?.body);
  if (result.status >= 400) throw new ApiError(result.status, result.body as ApiErrorBody);
  if (result.status === 204) return undefined as T;
  return result.body as T;
}

export async function backendFetch<T>(
  path: string,
  init?: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } }
): Promise<T> {
  return mockRequest<T>(path, init);
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  return mockRequest<T>(path, init);
}

export async function adminApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  return mockRequest<T>(path, init);
}

export function qs(params: Record<string, string | number | boolean | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  const s = search.toString();
  return s ? `?${s}` : "";
}
