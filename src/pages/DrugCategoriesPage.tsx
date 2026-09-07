import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CategoryFilterBar } from '../features/drugs/components/CategoryFilterBar';
import { CategoryTable } from '../features/drugs/components/CategoryTable';
import { CategoryModal } from '../features/drugs/components/CategoryModal';
import { showDeleteConfirm, showSuccessToast, showErrorToast } from '../utils/sweetalert';
import { useTypeDrugs } from '../features/drugs/hooks/useTypeDrugs';
import type { TypeDrug, CreateTypeDrugRequest } from '../features/drugs/types/Category.types';

const ITEMS_PER_PAGE = 5;

export default function DrugCategoriesPage() {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState<TypeDrug | null>(null);

    const {
        items: categories,
        loading,
        error,
        createItem,
        updateItem,
        deleteItem,
    } = useTypeDrugs();

    const filteredCategories = categories.filter((cat) =>
        cat.nama_jenis.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
    const paginatedCategories = filteredCategories.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleEdit = (category: TypeDrug) => {
        setSelectedCategoryForEdit(category);
        setIsModalOpen(true);
    };

    const handleDelete = (categoryToDelete: TypeDrug) => {
        const targetId = categoryToDelete.id ?? categoryToDelete.id_jenis;
        if (!targetId) return;

        showDeleteConfirm(async () => {
            try {
                await deleteItem(targetId);
                showSuccessToast(`Category "${categoryToDelete.nama_jenis}" deleted successfully.`);
            } catch (error: unknown) {
                showErrorToast(error instanceof Error ? error.message : 'Failed to delete category');
            }
        });
    };

    const handleSubmitModal = async (formData: CreateTypeDrugRequest) => {
        try {
            const targetId = selectedCategoryForEdit?.id ?? selectedCategoryForEdit?.id_jenis;
            if (selectedCategoryForEdit && targetId) {
                await updateItem(targetId, formData);
                showSuccessToast('Category updated successfully.');
            } else {
                await createItem(formData);
                showSuccessToast('Category created successfully.');
            }
            setIsModalOpen(false);
            setSelectedCategoryForEdit(null);
        } catch (error: unknown) {
            showErrorToast(error instanceof Error ? error.message : 'Failed to save data');
        }
    };

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Drug Categories
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Organize and classify medication inventory types.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setSelectedCategoryForEdit(null);
                        setIsModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20 shrink-0 self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    Add Category
                </button>
            </div>

            <CategoryFilterBar search={search} onSearchChange={handleSearchChange} />

            {error && (
                <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl border border-rose-100 text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
                    Memuat data dari server...
                </div>
            ) : (
                <CategoryTable
                    categories={paginatedCategories}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredCategories.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCategoryForEdit(null);
                }}
                onSubmit={handleSubmitModal}
                initialData={selectedCategoryForEdit}
            />
        </div>
    );
}
