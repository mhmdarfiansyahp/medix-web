import { Routes, Route, Navigate } from 'react-router-dom';
// import ProtectedRoute from '../routes/ProtectedRoute';
import MainLayout from '../components/layout/Layout';

// import LoginPage from '@/pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import DrugManagementPage from '../pages/DrugManagementPage';
import DrugCategoriesPage from '../pages/DrugCategoriesPage';
import UsersPage from '../pages/UsersPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      {/* <Route path="/login" element={<LoginPage />} /> */}

      {/* Protected Routes (Harus Login) */}
      {/* <Route element={<ProtectedRoute />}> */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/drug-management" element={<DrugManagementPage />} />
        <Route path="/drug-categories" element={<DrugCategoriesPage />} />
        <Route path='/users' element={<UsersPage />} />
        {/* Route halaman lainnya */}
      </Route>
      {/* </Route> */}

      {/* Catch-all 404 Route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}