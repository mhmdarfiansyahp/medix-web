import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import { tokenStorage } from '../services/api';
import type { User, UserRole } from '../features/users/types/user.types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    hasRole: (role: UserRole) => boolean;
    hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to check if token is expired
function isTokenExpired(token: string | null): boolean {
    if (!token) return true;
    try {
        const payload = token.split('.')[1];
        if (!payload) return true;
        const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        return decoded.exp * 1000 < Date.now();
    } catch {
        return true;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = tokenStorage.getToken();
            if (!token) {
                setLoading(false);
                return;
            }

            if (isTokenExpired(token)) {
                tokenStorage.clear();
                setLoading(false);
                return;
            }

            const storedUser = authService.getCurrentUser();
            if (storedUser) {
                setUser(storedUser);
            } else {
                tokenStorage.clear();
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        setLoading(true);
        try {
            await authService.login({ username, password });
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const isAuthenticated = !!user && !isTokenExpired(tokenStorage.getToken());

    const hasRole = (role: UserRole): boolean => {
        return user?.role === role;
    };

    const hasAnyRole = (roles: UserRole[]): boolean => {
        return user ? roles.includes(user.role) : false;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, hasRole, hasAnyRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
