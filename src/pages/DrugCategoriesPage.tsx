import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { CategoryFilterBar } from '../features/drugs/components/CategoryFilterBar';
import { CategoryTable } from '../features/drugs/components/CategoryTable';
import { CategoryModal } from '../features/drugs/components/CategoryModal';
import { showDeleteConfirm, showSuccessToast, showErrorToast } from '../utils/sweetalert';
import { typeDrugService } from '../services/typeDrugService';
import type { TypeDrug, CreateTypeDrugRequest } from '../features/drugs/types/Category.types';

const ITEMS_PER_PAGE = 5;

export default function DrugCategoriesPage() {
    const [categories, setCategories] = useState<TypeDrug[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState<TypeDrug | null>(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const data = await typeDrugService.getAll();
            setCategories(data);
        } catch (error: any) {
            showErrorToast(error.message || 'Gagal mengambil data dari server');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const filteredCategories = categories.filter((cat) =>
        cat.nama_jenis.toLowerCase().includes(search.toLowerCase())
    )

    const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
    const paginatedCategories = filteredCategories.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleEdit = (category: TypeDrug) => {
        setSelectedCategoryForEdit(category);
        setIsModalOpen(true);
    };

    const handleDelete = (categoryToEdit: TypeDrug) => {
        const targetId = categoryToEdit.id ?? categoryToEdit.id_jenis;
        if (!targetId) return;

        showDeleteConfirm(async () => {
            try {
                await typeDrugService.delete(targetId);
                showSuccessToast(`Category "${categoryToEdit.nama_jenis}" deleted successfully.`);
                fetchCategories();
            } catch (error: any) {
                showErrorToast(error.message || 'Failed to delete category');
            }
        });
    };

    const handleSubmitModal = async (formData: CreateTypeDrugRequest) => {
        try {
            const targetId = selectedCategoryForEdit?.id ?? selectedCategoryForEdit?.id_jenis;
            if (selectedCategoryForEdit && targetId) {
                await typeDrugService.update(targetId, formData);
                showSuccessToast(`Category updated successfully.`);
            } else {
                await typeDrugService.create(formData);
                showSuccessToast(`Category created successfully.`);
            }
            setIsModalOpen(false);
            setSelectedCategoryForEdit(null);
            fetchCategories();
        } catch (error: any) {
            showErrorToast(error.message || 'Failed to save data');
        }
    }

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
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20 shrink-0 self-start sm:self-auto">
                    <Plus className="w-4 h-4" />
                    Add Category
                </button>
            </div>

            <CategoryFilterBar search={search} onSearchChange={handleSearchChange} />

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