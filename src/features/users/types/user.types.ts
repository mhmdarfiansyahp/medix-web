export type UserRole = 'admin' | 'kasir' | 'owner';
export type UserStatus = 'aktif' | 'nonaktif' | '1' | '0';

export function isUserActive(status: UserStatus | number | string | unknown): boolean {
    return status === 'aktif' || status === 1 || status === '1';
}
export type RoleFilter = 'all' | UserRole;

export interface User {
    id_user: number;
    nama_user: string;
    no_telp: string | null;
    role: UserRole;
    username: string;
    status: UserStatus | number;
    foto: string | null;
    must_change_password?: boolean;
}

export interface ResetPasswordResult {
    password: string;
    message: string;
}

export interface CreateUserRequest {
    nama_user: string;
    no_telp?: string | null;
    role: UserRole;
    username: string;
    password: string;
    status?: number;
    foto?: string | null;
}

export type UpdateUserRequest = Partial<CreateUserRequest>;

export interface UserPagination {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
}

export interface UserListResponse {
    data: User[];
    pagination: UserPagination;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    refresh_token: string;
    user: User;
}

export interface UserFilterParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
    status?: string;
}