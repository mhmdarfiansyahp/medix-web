import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import type {
    User,
    UserRole,
    UserStatus,
    CreateUserRequest,
    UpdateUserRequest,
} from "../types/user.types";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: User | null;
    onSuccess: () => void;

    createUser: (payload: CreateUserRequest) => Promise<User>;
    updateUser: (
        id: number | string,
        payload: UpdateUserRequest
    ) => Promise<User>;
}

export const UserModal: React.FC<UserModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSuccess,
    createUser,
    updateUser,
}) => {
    const isEdit = !!initialData;

    const [namaUser, setNamaUser] = useState("");
    const [noTelp, setNoTelp] = useState("");
    const [role, setRole] = useState<UserRole>("kasir");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<UserStatus>("aktif");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setNamaUser(initialData.nama_user);
            setNoTelp(initialData.no_telp || "");
            setRole(initialData.role);
            setUsername(initialData.username);
            setStatus(initialData.status);
            setPassword("");
        } else {
            setNamaUser("");
            setNoTelp("");
            setRole("kasir");
            setUsername("");
            setPassword("");
            setStatus("aktif");
        }

        setError(null);
    }, [initialData, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            if (isEdit && initialData) {
                const payload: UpdateUserRequest = {
                    nama_user: namaUser,
                    no_telp: noTelp || null,
                    role,
                    username,
                    status,
                };

                if (password.trim()) {
                    payload.password = password;
                }

                await updateUser(initialData.id_user, payload);
            } else {
                const payload: CreateUserRequest = {
                    nama_user: namaUser,
                    no_telp: noTelp || null,
                    role,
                    username,
                    password,
                    status,
                };

                await createUser(payload);
            }

            onSuccess();
        } catch (err: any) {
            setError(
                err?.message ||
                (isEdit
                    ? "Gagal memperbarui user."
                    : "Gagal membuat user.")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {isEdit ? "Edit User" : "Add User"}
                        </h2>

                        <p className="text-xs text-slate-500 mt-0.5">
                            {isEdit
                                ? "Update user information."
                                : "Create a new system user."}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Nama */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Nama User
                        </label>

                        <input
                            type="text"
                            value={namaUser}
                            onChange={(e) => setNamaUser(e.target.value)}
                            required
                            maxLength={100}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan nama user"
                        />
                    </div>

                    {/* No Telp */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            No. Telepon
                        </label>

                        <input
                            type="text"
                            value={noTelp}
                            onChange={(e) => setNoTelp(e.target.value)}
                            maxLength={13}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan nomor telepon"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Username
                        </label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            maxLength={50}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan username"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Password
                            {isEdit && (
                                <span className="text-xs text-slate-400 ml-1">
                                    (kosongkan jika tidak diubah)
                                </span>
                            )}
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={!isEdit}
                            minLength={6}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan password"
                        />
                    </div>

                    {/* Role & Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Role
                            </label>

                            <select
                                value={role}
                                onChange={(e) =>
                                    setRole(e.target.value as UserRole)
                                }
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="admin">Admin</option>
                                <option value="kasir">Kasir</option>
                                <option value="owner">Owner</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Status
                            </label>

                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value as UserStatus)
                                }
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="aktif">Active</option>
                                <option value="nonaktif">Nonactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading
                                ? "Saving..."
                                : isEdit
                                    ? "Save Changes"
                                    : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};