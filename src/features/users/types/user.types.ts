export type UserRole = 'Admin' | 'Kasir' | 'Owner';
export type UserStatus = 'Active' | 'Nonactive';

export interface User {
    id: string;
    name: string;
    email: string;
    initials: string;
    avatarBg: string;
    role: UserRole;
    status: UserStatus;
    lastLogin: string;
}

export type RoleFilter = 'All' | UserRole;