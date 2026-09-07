import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';
import MainLayout from '../components/layout/Layout';

import LoginPage from '../pages/LoginPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import DashboardPage from '../pages/DashboardPage';
import DrugManagementPage from '../pages/DrugManagementPage';
import DrugCategoriesPage from '../pages/DrugCategoriesPage';
import StockAlertsPage from '../pages/StockAlertsPage';
import ReportsPage from '../pages/ReportsPage';
import TransactionsPage from '../pages/TransactionsPage';
import SettingsPage from '../pages/SettingsPage';
import UsersPage from '../pages/UsersPage';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes (Harus Login) */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Route>
            </Route>

            {/* Admin-only routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route element={<MainLayout />}>
                    <Route path="/drug-management" element={<DrugManagementPage />} />
                    <Route path="/drug-categories" element={<DrugCategoriesPage />} />
                    <Route path="/stock-alerts/low-stock" element={<StockAlertsPage />} />
                    <Route path="/stock-alerts/expiring-soon" element={<StockAlertsPage />} />
                    <Route path='/users' element={<UsersPage />} />
                </Route>
            </Route>

            {/* Admin + Owner routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'owner']} />}>
                <Route element={<MainLayout />}>
                    <Route path="/reports" element={<ReportsPage />} />
                </Route>
            </Route>

            {/* Admin + Kasir + Owner routes (transactions & settings) */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'kasir', 'owner']} />}>
                <Route element={<MainLayout />}>
                    <Route path="/transactions" element={<TransactionsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>
            </Route>

            {/* Catch-all 404 Route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
