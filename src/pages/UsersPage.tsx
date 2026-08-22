import React from 'react';
import { UserManagementTable } from '../features/users/components/UserManagementTable';

export const UsersPage: React.FC = () => {
    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <UserManagementTable />
        </div>
    );
};

export default UsersPage;