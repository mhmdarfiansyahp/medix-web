export type UserRole = 'admin' | 'kasir' | 'owner';
export type UserStatus = 'aktif' | 'nonaktif';
export type RoleFilter = 'all' | UserRole;

export interface User {
    id_user: number;
    nama_user: string;
    no_telp: string | null;
    role: UserRole;
    username: string;
    status: UserStatus;
    foto: string | null;
}

export interface CreateUserRequest {
    nama_user: string;
    no_telp?: string | null;
    role: UserRole;
    username: string;
    password: string;
    status?: UserStatus;
    foto?: string | null;
}

export type UpdateUserRequest = Partial<CreateUserRequest>;
export interface ApiResponse<T> {
    message?: string;
    data?: T;
    error?: string;
}

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

export interface UserFilterParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
    status?: UserStatus;
}