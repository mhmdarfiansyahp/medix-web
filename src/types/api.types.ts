export interface ApiResponse<T> {
    status: 'success' | 'error';
    message: string;
    data: T;
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}

export class ApiError extends Error {
    status: number;
    code?: string;
    data?: unknown;

    constructor(message: string, status: number, code?: string, data?: unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.data = data;
    }
}
