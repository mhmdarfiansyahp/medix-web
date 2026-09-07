import { ApiError } from '../types/api.types';
import { buildUrl } from '../utils/api-helpers';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const LOGIN_PATH = '/login';

export const tokenStorage = {
    getToken: (): string | null => localStorage.getItem('medix_token'),
    setToken: (token: string): void => {
        localStorage.setItem('medix_token', token);
    },
    clear: (): void => {
        localStorage.removeItem('medix_token');
    },
};

export const userStorage = {
    getUser: <T = unknown>(): T | null => {
        const raw = localStorage.getItem('medix_user');
        if (!raw) return null;
        try {
            return JSON.parse(raw) as T;
        } catch {
            return null;
        }
    },
    setUser: (user: unknown): void => {
        localStorage.setItem('medix_user', JSON.stringify(user));
    },
    clear: (): void => {
        localStorage.removeItem('medix_user');
    },
};

export interface RequestConfig extends Omit<RequestInit, 'method' | 'body'> {
    params?: Record<string, unknown>;
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

class ApiClient {
    async request<T>(method: RequestMethod, endpoint: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
        const url = buildUrl(`${API_BASE_URL}${endpoint}`, config.params);
        const response = await this.executeFetch(url, method, body, config);
        return this.handleResponse<T>(response);
    }

    private async executeFetch(
        url: string,
        method: RequestMethod,
        body?: unknown,
        config: RequestConfig = {}
    ): Promise<Response> {
        const headers = await this.buildHeaders(body, config.headers);

        return fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            ...config,
        });
    }

    private async buildHeaders(body: unknown, customHeaders?: HeadersInit): Promise<HeadersInit> {
        const headers: Record<string, string> = {
            Accept: 'application/json',
        };

        if (body) {
            headers['Content-Type'] = 'application/json';
        }

        const token = tokenStorage.getToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        if (customHeaders) {
            const normalized =
                customHeaders instanceof Headers
                    ? Object.fromEntries(customHeaders.entries())
                    : Array.isArray(customHeaders)
                        ? Object.fromEntries(customHeaders)
                        : (customHeaders as Record<string, string>);

            Object.assign(headers, normalized);
        }

        return headers;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            await this.throwApiError(response);
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            return undefined as T;
        }

        if (response.status === 204) {
            return undefined as T;
        }

        return response.json() as Promise<T>;
    }

    private async throwApiError(response: Response): Promise<never> {
        const text = await response.text().catch(() => '');
        let parsed: unknown;
        let message = text;

        if (text) {
            try {
                parsed = JSON.parse(text);
                const errorMessage = (parsed as { message?: string }).message;
                if (errorMessage) message = errorMessage;
            } catch {
                // Keep raw text for non-JSON error bodies (502/504 HTML, etc.)
            }
        }

        if (response.status === 401) {
            this.handleAuthFailure();
        }

        throw new ApiError(
            message || `Request failed with status ${response.status}`,
            response.status,
            undefined,
            parsed ?? text
        );
    }

    private handleAuthFailure(): void {
        tokenStorage.clear();
        userStorage.clear();
        if (window.location.pathname !== LOGIN_PATH) {
            window.location.href = LOGIN_PATH;
        }
    }

    get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this.request<T>('GET', endpoint, undefined, config);
    }

    post<T>(endpoint: string, body: unknown, config?: RequestConfig): Promise<T> {
        return this.request<T>('POST', endpoint, body, config);
    }

    put<T>(endpoint: string, body: unknown, config?: RequestConfig): Promise<T> {
        return this.request<T>('PUT', endpoint, body, config);
    }

    patch<T>(endpoint: string, body: unknown, config?: RequestConfig): Promise<T> {
        return this.request<T>('PATCH', endpoint, body, config);
    }

    delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this.request<T>('DELETE', endpoint, undefined, config);
    }
}

export const apiClient = new ApiClient();

// Backward-compatible wrapper for legacy service modules during migration.
export async function fetchClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const method = (options?.method as RequestMethod) || 'GET';
    const { body, ...config } = options || {};
    return apiClient.request<T>(method, endpoint, body, config);
}
