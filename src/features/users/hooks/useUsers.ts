import { useState, useEffect, useCallback } from 'react';
import type {
    User,
    CreateUserRequest,
    UpdateUserRequest,
    UserFilterParams,
    ResetPasswordResult,
} from '../types/user.types';
import type { PaginationMeta } from '../../../types/api.types';
import { userService } from '../../../services/userService';
import { getErrorMessage } from '../../../utils/api-helpers';

export const useUsers = (initialParams?: UserFilterParams) => {
    const [items, setItems] = useState<User[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta>({
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

                setItems(response.data ?? []);
                setPagination(response.pagination);
            } catch (err: unknown) {
                setError(getErrorMessage(err, 'Failed to fetch users'));
            } finally {
                setLoading(false);
            }
        },
        [params]
    );

    useEffect(() => {
        // Data-fetching effect: loading state is set immediately on mount/filter change.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAll(params);
    }, [params, fetchAll]);

    const createUser = async (payload: CreateUserRequest) => {
        const newUser = await userService.create(payload);
        await fetchAll(params);
        return newUser;
    };

    const updateUser = async (id: number | string, payload: UpdateUserRequest) => {
        const updatedUser = await userService.update(id, payload);
        await fetchAll(params);
        return updatedUser;
    };

    const deleteUser = async (id: number | string) => {
        await userService.delete(id);
        await fetchAll(params);
    };

    const resetPassword = async (id: number | string): Promise<ResetPasswordResult> => {
        const result = await userService.resetPassword(id);
        await fetchAll(params);
        return result;
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
        resetPassword,
    };
};
