import { apiClient, tokenStorage, userStorage } from './api';
import type { LoginRequest, LoginResponse, User } from '../features/users/types/user.types';
import { extractResponseData } from '../utils/api-helpers';

const ENDPOINT = '/users';

export const authService = {
    login: async (payload: LoginRequest): Promise<LoginResponse> => {
        const res = await apiClient.post<{
            status: string;
            message: string;
            data?: LoginResponse;
        }>(`${ENDPOINT}/login`, payload);

        const data = extractResponseData<LoginResponse>(res, 'Login response');
        tokenStorage.setToken(data.token);
        userStorage.setUser(data.user);
        return data;
    },

    refresh: async (): Promise<LoginResponse> => {
        const res = await apiClient.post<{
            status: string;
            message: string;
            data?: LoginResponse;
        }>(`${ENDPOINT}/refresh`);

        const data = extractResponseData<LoginResponse>(res, 'Token refresh response');
        tokenStorage.setToken(data.token);
        userStorage.setUser(data.user);
        return data;
    },

    logout: (): void => {
        tokenStorage.clear();
        userStorage.clear();
        window.location.href = '/login';
    },

    getProfile: async (): Promise<User> => {
        const res = await apiClient.get<{
            status: string;
            message: string;
            data?: User;
        }>(`${ENDPOINT}/profile`);
        const user = extractResponseData<User>(res, 'User profile');
        userStorage.setUser(user);
        return user;
    },

    updateProfile: async (payload: Partial<User>): Promise<User> => {
        const res = await apiClient.put<{
            status: string;
            message: string;
            data?: User;
        }>(`${ENDPOINT}/profile`, payload);
        const user = extractResponseData<User>(res, 'Updated profile');
        userStorage.setUser(user);
        return user;
    },

    getCurrentUser: (): User | null => userStorage.getUser<User>(),
};
