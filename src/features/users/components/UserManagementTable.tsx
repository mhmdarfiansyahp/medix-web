import React, { useState } from 'react';
import {
    Search,
    Download,
    UserPlus,
    Edit3,
    ShieldCheck,
    CreditCard,
    Store,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import type { User, RoleFilter } from '../types/user.types';

const mockUsers: User[] = [
    {
        id: '1',
        name: 'Dr. Sarah Jenkins',
        email: 'sarah.j@potekgas.com',
        initials: 'DR',
        avatarBg: 'bg-indigo-100 text-indigo-700',
        role: 'Admin',
        status: 'Active',
        lastLogin: 'Today, 08:42 AM',
    },
    {
        id: '2',
        name: 'Marcus Wong',
        email: 'm.wong@potekgas.com',
        initials: 'MW',
        avatarBg: 'bg-teal-100 text-teal-700',
        role: 'Kasir',
        status: 'Active',
        lastLogin: 'Yesterday, 14:15 PM',
    },
    {
        id: '3',
        name: 'Amanda Lewis',
        email: 'a.lewis@potekgas.com',
        initials: 'AL',
        avatarBg: 'bg-rose-100 text-rose-700',
        role: 'Owner',
        status: 'Nonactive',
        lastLogin: 'Oct 12, 2023',
    },
    {
        id: '4',
        name: 'Tom Jones',
        email: 't.jones@potekgas.com',
        initials: 'TJ',
        avatarBg: 'bg-blue-100 text-blue-700',
        role: 'Kasir',
        status: 'Nonactive',
        lastLogin: 'Sep 01, 2023',
    },
];

export const UserManagementTable: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<RoleFilter>('All');

    const filteredUsers = mockUsers.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id.includes(searchTerm);
        const matchesRole = selectedRole === 'All' || user.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    const renderRoleBadge = (role: User['role']) => {
        switch (role) {
            case 'Admin':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Admin
                    </span>
                );
            case 'Kasir':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        <CreditCard className="w-3.5 h-3.5" />
                        Kasir
                    </span>
                );
            case 'Owner':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <Store className="w-3.5 h-3.5" />
                        Owner
                    </span>
                );
        }
    };

    const renderStatusBadge = (status: User['status']) => {
        switch (status) {
            case 'Active':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                    </span>
                );
            case 'Nonactive':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Offline
                    </span>
                )
        }
    };

    return (
        <div className="space-y-6">
            {/* Action Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">System Users</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage staff access, roles, and permissions across the pharmacy.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-blue-600 hover:bg-slate-50 transition shadow-xs">
                        <Download className="w-4 h-4" />
                        Export User List
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition shadow-xs">
                        <UserPlus className="w-4 h-4" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
                {/* Search & Filter Bar */}
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        />
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100/70 p-1 rounded-lg">
                        {(['All', 'Admin', 'Owner', 'Kasir'] as RoleFilter[]).map((role) => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${selectedRole === role
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                {role === 'All' ? 'All Roles' : role}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table View */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/70 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="py-3.5 px-6">User Details</th>
                                <th className="py-3.5 px-6">Role</th>
                                <th className="py-3.5 px-6">Status</th>
                                <th className="py-3.5 px-6">Last Login</th>
                                <th className="py-3.5 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${user.avatarBg}`}>
                                                {user.initials}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{user.name}</div>
                                                <div className="text-xs text-slate-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">{renderRoleBadge(user.role)}</td>
                                    <td className="py-4 px-6">{renderStatusBadge(user.status)}</td>
                                    <td className="py-4 px-6 text-slate-600 font-medium">{user.lastLogin}</td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 text-xs text-slate-500">
                    <div>
                        Showing <span className="font-semibold text-slate-800">1</span> to{' '}
                        <span className="font-semibold text-slate-800">{filteredUsers.length}</span> of{' '}
                        <span className="font-semibold text-slate-800">24</span> users
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};