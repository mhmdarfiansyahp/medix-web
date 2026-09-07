import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { tokenStorage } from '../services/api';
import { authService } from '../services/authService';
import type { UserRole } from '../features/users/types/user.types';

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const location = useLocation();
    const token = tokenStorage.getToken();
    const user = authService.getCurrentUser();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
