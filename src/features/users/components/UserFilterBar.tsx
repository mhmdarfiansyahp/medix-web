import React from "react";
import { Search } from "lucide-react";
import type { UserRole, UserStatus } from "../types/user.types";

interface UserFilterBarProps {
    search: string;
    onSearchChange: (value: string) => void;
    selectedRole: UserRole | "";
    onRoleChange: (value: UserRole | "") => void;
    selectedStatus: UserStatus | "";
    onStatusChange: (value: UserStatus | "") => void;
}

export const UserFilterBar: React.FC<UserFilterBarProps> = ({
    search,
    onSearchChange,
    selectedRole,
    onRoleChange,
    selectedStatus,
    onStatusChange,
}) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                        type="text"
                        placeholder="Search by name, username, or ID..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    />
                </div>

                <select
                    value={selectedRole}
                    onChange={(e) => onRoleChange(e.target.value as UserRole | "")}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="kasir">Kasir</option>
                    <option value="owner">Owner</option>
                </select>

                {/* Status */}
                <select
                    value={selectedStatus}
                    onChange={(e) => onStatusChange(e.target.value as UserStatus | "")}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Status</option>
                    <option value="aktif">Active</option>
                    <option value="nonaktif">Nonactive</option>
                </select>
            </div>
        </div>
    );
};