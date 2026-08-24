import { fetchClient } from './api';

import type {
    User,
    CreateUserRequest,
    UpdateUserRequest,
    ApiResponse,
    UserPagination,
    UserFilterParams
} from '../features/users/types/user.types';

const ENDPOINT = '/users';

export const userService = {
    getAll: async (params?: UserFilterParams):
        Promise<{
            data: User[];
            pagination: UserPagination;
        }> => {
        const query = new URLSearchParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (
                    value !== undefined &&
                    value !== null &&
                    value !== ""
                ) {
                    query.append(key, String(value));
                }
            });
        }

        const queryString = query.toString();

        const url = queryString
            ? `${ENDPOINT}?${queryString}`
            : ENDPOINT;

        const res = await fetchClient<{
            message?: string;
            data: User[];
            pagination: UserPagination;
        }>(url);

        return {
            data: res.data || [],
            pagination: res.pagination,
        };
    },

    getById: async (id: number | string): Promise<User> => {
        const res = await fetchClient<ApiResponse<User>>(`${ENDPOINT}/${id}`);
        return res.data!;
    },

    create: async (payload: CreateUserRequest): Promise<User> => {
        const res = await fetchClient<ApiResponse<User>>(ENDPOINT, {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        return res.data!;
    },

    update: async (
        id: number | string,
        payload: UpdateUserRequest
    ): Promise<User> => {
        const res = await fetchClient<ApiResponse<User>>(`${ENDPOINT}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });

        return res.data!;
    },

    delete: async (id: number | string): Promise<void> => {
        await fetchClient<ApiResponse<null>>(`${ENDPOINT}/${id}`, {
            method: 'DELETE',
        });
    },
};