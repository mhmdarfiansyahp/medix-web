import type { ApiResponse } from '../types/api.types';

export function encodePathParam(value: string | number): string {
    return encodeURIComponent(String(value));
}

export function buildSearchParams(params: Record<string, unknown>): URLSearchParams {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === '') continue;

        if (Array.isArray(value)) {
            value.forEach((item) => searchParams.append(key, String(item)));
        } else {
            searchParams.append(key, String(value));
        }
    }

    return searchParams;
}

export function buildUrl(endpoint: string, params?: Record<string, unknown>): string {
    const query = params ? buildSearchParams(params).toString() : '';
    return query ? `${endpoint}?${query}` : endpoint;
}

export function isErrorWithMessage(error: unknown): error is { message: string } {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Record<string, unknown>).message === 'string'
    );
}

export function getErrorMessage(error: unknown, fallback = 'Terjadi kesalahan'): string {
    if (error instanceof Error) return error.message;
    if (isErrorWithMessage(error)) return error.message;
    return fallback;
}

export function isDefined<T>(value: T | undefined | null): value is T {
    return value !== undefined && value !== null;
}

export function assertDefined<T>(value: T | undefined | null, label: string): T {
    if (!isDefined(value)) {
        throw new Error(`${label} tidak ditemukan`);
    }
    return value;
}

export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
    return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        'status' in value &&
        'message' in value &&
        'data' in value
    );
}

export function extractResponseData<T>(response: unknown, label: string): T {
    if (isApiResponse<T>(response) && response.data !== undefined && response.data !== null) {
        return response.data;
    }

    throw new Error(`${label} tidak ditemukan dalam response`);
}

export function normalizePagination(
    backend?: { current_page?: number; total_pages?: number; total_items?: number; items_per_page?: number } | null,
    fallback?: { currentPage?: number; itemsPerPage?: number; totalItems?: number }
): { currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number } {
    const currentPage = (backend?.current_page ?? fallback?.currentPage) ?? 1;
    const itemsPerPage = (backend?.items_per_page ?? fallback?.itemsPerPage) ?? 10;
    const totalItems = (backend?.total_items ?? fallback?.totalItems) ?? 0;
    const totalPages = (backend?.total_pages ?? Math.ceil(totalItems / itemsPerPage)) || 1;

    return { currentPage, totalPages, totalItems, itemsPerPage };
}

export function isClientSidePaginationNeeded(totalItems: number, params?: { page?: number; limit?: number }): boolean {
    return totalItems > 0 && (!params?.page && !params?.limit);
}
