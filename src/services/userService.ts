import { apiClient } from './api';
import type {
    User,
    CreateUserRequest,
    UpdateUserRequest,
    UserFilterParams,
    UserListResponse,
    ResetPasswordResult,
} from '../features/users/types/user.types';
import type { PaginatedResponse } from '../types/api.types';
import { encodePathParam, normalizePagination } from '../utils/api-helpers';

const ENDPOINT = '/users';

export const userService = {
    getAll: async (params?: UserFilterParams): Promise<PaginatedResponse<User>> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: UserListResponse;
        }>(ENDPOINT, { params: params as Record<string, unknown> });

        const data = res.data || { data: [], pagination: { current_page: 1, total_pages: 1, total_items: 0, items_per_page: 10 } };

        return {
            data: data.data || [],
            pagination: normalizePagination(
                data.pagination,
                {
                    currentPage: params?.page,
                    itemsPerPage: params?.limit,
                    totalItems: data.data?.length ?? 0,
                }
            ),
        };
    },

    getById: async (id: number | string): Promise<User> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: User;
        }>(`${ENDPOINT}/${encodePathParam(id)}`);
        if (!res.data) throw new Error('User tidak ditemukan');
        return res.data;
    },

    create: async (payload: CreateUserRequest): Promise<User> => {
        const res = await apiClient.post<{
            status: string;
            message: string;
            data?: User;
        }>(ENDPOINT, payload);
        if (!res.data) throw new Error('Gagal membuat user');
        return res.data;
    },

    update: async (id: number | string, payload: UpdateUserRequest): Promise<User> => {
        const res = await apiClient.put<{
            status: string;
            message: string;
            data?: User;
        }>(`${ENDPOINT}/${encodePathParam(id)}`, payload);
        if (!res.data) throw new Error('Gagal memperbarui user');
        return res.data;
    },

    delete: async (id: number | string): Promise<void> => {
        await apiClient.delete(`${ENDPOINT}/${encodePathParam(id)}`);
    },

    resetPassword: async (id: number | string): Promise<ResetPasswordResult> => {
        const res = await apiClient.post<{
            status: string;
            message: string;
            data?: ResetPasswordResult;
        }>(`${ENDPOINT}/${encodePathParam(id)}/reset-password`, {});
        if (!res.data) throw new Error('Gagal mereset password user');
        return res.data;
    },
};
