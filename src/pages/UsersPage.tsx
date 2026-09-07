import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

import { UserFilterBar } from "../features/users/components/UserFilterBar";
import { UserTable } from "../features/users/components/UserManagementTable";
import { UserModal } from "../features/users/components/UserModal";

import { showSuccessToast, showErrorToast } from "../utils/sweetalert";
import { useUsers } from "../features/users/hooks/useUsers";
import type { User, UserStatus, UserRole } from "../features/users/types/user.types";

export default function UsersPage() {
    const [search, setSearch] = useState("");
    const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
    const [selectedStatus, setSelectedStatus] = useState<UserStatus | "">("");
    const [currentPage, setCurrentPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);

    const {
        items: users,
        pagination,
        loading: usersLoading,
        error,
        setParams,
        refetch,
        createUser,
        updateUser,
        deleteUser,
    } = useUsers({
        page: 1,
        limit: 10,
    });

    useEffect(() => {
        const statusParam =
            selectedStatus === "aktif"
                ? "1"
                : selectedStatus === "nonaktif"
                    ? "0"
                    : undefined;

        setParams({
            page: currentPage,
            limit: 10,
            search: search.trim() || undefined,
            role: selectedRole || undefined,
            status: statusParam,
        });
    }, [
        search,
        selectedRole,
        selectedStatus,
        currentPage,
        setParams,
    ]);

    // const filteredUsers = users.filter((user) => {
    //     const searchValue = search.toLowerCase().trim();

    //     const matchesSearch =
    //         user.nama_user.toLowerCase().includes(searchValue) ||
    //         user.username.toLowerCase().includes(searchValue) ||
    //         user.id_user.toString().includes(searchValue);

    //     const matchesRole =
    //         !selectedRole || user.role === selectedRole;

    //     const matchesStatus =
    //         !selectedStatus || user.status === selectedStatus;

    //     return matchesSearch && matchesRole && matchesStatus;
    // });

    const handleEdit = (user: User) => {
        setSelectedUserForEdit(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (user: User) => {
        try {
            await deleteUser(user.id_user);
            showSuccessToast(
                `User "${user.nama_user}" berhasil dihapus.`
            );
        } catch (error: unknown) {
            showErrorToast(
                error instanceof Error ? error.message : "Gagal menghapus user."
            );
        }
    };

    const handleModalSuccess = async () => {
        await refetch();

        setIsModalOpen(false);
        setSelectedUserForEdit(null);

        showSuccessToast(
            selectedUserForEdit
                ? "User berhasil diperbarui."
                : "User berhasil dibuat."
        );
    };

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        System Users
                    </h1>

                    <p className="text-sm text-slate-500 mt-0.5">
                        Manage staff access, roles, and permissions across the pharmacy.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setSelectedUserForEdit(null);
                        setIsModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20 shrink-0 self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    Add User
                </button>
            </div>

            <UserFilterBar
                search={search}
                onSearchChange={setSearch}
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
            />

            <UserTable
                users={users}
                isLoading={usersLoading}
                error={error}
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={setCurrentPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <UserModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedUserForEdit(null);
                }}
                initialData={selectedUserForEdit}
                onSuccess={handleModalSuccess}
                createUser={createUser}
                updateUser={updateUser}
            />
        </div>
    );
}