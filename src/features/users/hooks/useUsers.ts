import { useState, useEffect, useCallback } from 'react';

import type {
    User,
    CreateUserRequest,
    UpdateUserRequest,
    UserFilterParams,
} from '../types/user.types';

import { userService } from '../../../services/userService';

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export const useUsers = (initialParams?: UserFilterParams) => {
    const [items, setItems] = useState<User[]>([]);
    const [pagination, setPagination] =
        useState<PaginationMeta>({
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10,
        });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [params, setParams] = useState<UserFilterParams | undefined>(initialParams);

    const fetchAll = useCallback(
        async (overrideParams?: UserFilterParams) => {
            setLoading(true);
            setError(null);

            try {
                const queryParams = overrideParams ?? params;
                const response = await userService.getAll(queryParams);

                setItems(response.data);
                setPagination({
                    currentPage:
                        response.pagination.current_page,
                    totalPages:
                        response.pagination.total_pages,
                    totalItems:
                        response.pagination.total_items,
                    itemsPerPage:
                        response.pagination.items_per_page,
                });
            } catch (err: any) {
                setError(
                    err?.message ||
                    "Failed to fetch users"
                );
            } finally {
                setLoading(false);
            }
        },
        [params]
    );


    useEffect(() => {
        fetchAll(params);
    }, [params]);

    const createUser = async (payload: CreateUserRequest) => {
        const newUser = await userService.create(payload);
        await fetchAll(params);

        return newUser;
    };

    const updateUser = async (
        id: number | string,
        payload: UpdateUserRequest
    ) => {
        const updatedUser = await userService.update(id, payload);

        await fetchAll(params);
        return updatedUser;
    };

    const deleteUser = async (id: number | string) => {
        await userService.delete(id);
        await fetchAll(params);
    };

    return {
        items,
        pagination,
        loading,
        error,
        params,
        setParams,
        refetch: () => fetchAll(params),
        createUser,
        updateUser,
        deleteUser,
    }
}