import React from "react";
import {
    ChevronLeft,
    ChevronRight,
    Users,
} from "lucide-react";
import {
    Edit3,
    Trash2,
    ShieldCheck,
    CreditCard,
    Store,
    KeyRound,
} from "lucide-react";

import { isUserActive, type User } from "../types/user.types";

interface UserTableProps {
    users: User[];
    isLoading: boolean;
    error?: string | null;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onResetPassword: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
    users,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onEdit,
    onDelete,
    onResetPassword,
}) => {
    const getInitials = (name: string) => {
        return name
            .trim()
            .split(/\s+/)
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };
    
    const startItem =
        totalItems === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;

    const endItem =
        Math.min(currentPage * itemsPerPage, totalItems);

    const renderRoleBadge = (role: User["role"]) => {
        switch (role) {
            case "admin":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Admin
                    </span>
                );

            case "kasir":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        <CreditCard className="w-3.5 h-3.5" />
                        Kasir
                    </span>
                );

            case "owner":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <Store className="w-3.5 h-3.5" />
                        Owner
                    </span>
                );
        }
    };

    const renderStatusBadge = (status: User["status"]) => {
        if (isUserActive(status)) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Nonactive
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-12 text-center text-sm text-slate-400">
                Loading users...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl border border-rose-100 text-sm">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 border-collapse">
                    <thead className="bg-[#eef2f6] text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                        <tr>
                            <th className="py-3.5 px-6">User Details</th>
                            <th className="py-3.5 px-6">Role</th>
                            <th className="py-3.5 px-6">Phone</th>
                            <th className="py-3.5 px-6">Status</th>
                            <th className="py-3.5 px-6 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {users.map((user) => (
                            <tr
                                key={user.id_user}
                                className="hover:bg-slate-50/80 transition-colors"
                            >
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs bg-blue-100 text-blue-700">
                                            {getInitials(user.nama_user)}
                                        </div>

                                        <div>
                                            <div className="font-bold text-slate-900">
                                                {user.nama_user}
                                            </div>

                                            <div className="text-xs text-slate-500">
                                                @{user.username}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="py-4 px-6">
                                    {renderRoleBadge(user.role)}
                                </td>

                                <td className="py-4 px-6 text-slate-600">
                                    {user.no_telp || "-"}
                                </td>

                                <td className="py-4 px-6">
                                    {renderStatusBadge(user.status)}
                                </td>

                                <td className="py-4 px-6 text-right">
                                    <div className="inline-flex items-center gap-1">
                                        <button
                                            onClick={() => onEdit(user)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit user"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => onResetPassword(user)}
                                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                            title="Reset password"
                                        >
                                            <KeyRound className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => onDelete(user)}
                                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                            title="Delete user"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
                <div>
                    Showing{" "}
                    <span className="font-semibold text-slate-800">
                        {startItem}
                    </span>{" "}
                    -{" "}
                    <span className="font-semibold text-slate-800">
                        {endItem}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-800">
                        {totalItems}
                    </span>{" "}
                    users
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1 || totalPages === 0}
                        title="Previous Page"
                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold shadow-sm select-none">
                        {currentPage} / {totalPages || 1}
                    </span>

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages || totalPages === 0}
                        title="Next Page"
                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {users.length === 0 && (
                <div className="py-12 text-center text-sm text-slate-500">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    No users found.
                </div>
            )}
        </div>
    );
};