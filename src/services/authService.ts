import { apiClient, tokenStorage, userStorage } from './api';
import type { LoginRequest, LoginResponse, User, ForgotPasswordRequest, ResetPasswordTokenRequest, ChangePasswordRequest } from '../features/users/types/user.types';
import { extractResponseData, extractOkResponse } from '../utils/api-helpers';

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
        tokenStorage.setRefreshToken(data.refresh_token as string);
        userStorage.setUser(data.user);
        return data;
    },

    refresh: async (): Promise<LoginResponse> => {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }
        const res = await apiClient.post<{
            status: string;
            message: string;
            data?: LoginResponse;
        }>(`${ENDPOINT}/refresh`, { refresh_token: refreshToken });

        const data = extractResponseData<LoginResponse>(res, 'Token refresh response');
        tokenStorage.setToken(data.token);
        tokenStorage.setRefreshToken(data.refresh_token as string);
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

    forgotPassword: async (email: string): Promise<void> => {
        const payload: ForgotPasswordRequest = { identifier: email };
        const res = await apiClient.post<{
            status: string;
            message: string;
        }>(`${ENDPOINT}/forgot-password`, payload);
        extractOkResponse(res);
    },

    resetPasswordWithToken: async (token: string, newPassword: string): Promise<void> => {
        const payload: ResetPasswordTokenRequest = { token, new_password: newPassword };
        const res = await apiClient.post<{
            status: string;
            message: string;
        }>(`${ENDPOINT}/reset-password`, payload);
        extractOkResponse(res);
    },

    changePassword: async (payload: ChangePasswordRequest): Promise<void> => {
        const res = await apiClient.post<{
            status: string;
            message: string;
        }>(`${ENDPOINT}/profile/password`, payload);
        extractOkResponse(res);
    },

    getCurrentUser: (): User | null => userStorage.getUser<User>(),
};
