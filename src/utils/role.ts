import type { UserRole } from '../features/users/types/user.types';
import { authService } from '../services/authService';

export type RoutePermission =
    | 'dashboard'
    | 'drug-management'
    | 'drug-categories'
    | 'stock-alerts'
    | 'reports'
    | 'user-management'
    | 'transactions'
    | 'settings';

const ROLE_PERMISSIONS: Record<UserRole, RoutePermission[]> = {
    admin: [
        'dashboard',
        'drug-management',
        'drug-categories',
        'stock-alerts',
        'reports',
        'user-management',
        'transactions',
        'settings',
    ],
    kasir: ['dashboard', 'transactions', 'settings'],
    owner: ['dashboard', 'reports', 'settings'],
};

export function getCurrentRole(): UserRole | null {
    return authService.getCurrentUser()?.role ?? null;
}

export function hasPermission(permission: RoutePermission): boolean {
    const role = getCurrentRole();
    if (!role) return false;
    return ROLE_PERMISSIONS[role].includes(permission);
}

export function hasAnyPermission(permissions: RoutePermission[]): boolean {
    return permissions.some((permission) => hasPermission(permission));
}

export function getDefaultRouteForRole(role: UserRole | null): string {
    if (!role) return '/login';
    if (role === 'kasir') return '/transactions';
    return '/dashboard';
}
