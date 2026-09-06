import { Edit2, Trash2, FolderKanban, ChevronLeft, ChevronRight } from "lucide-react";
import type { TypeDrug } from "../types/Category.types";

interface CategoryTableProps {
    categories: TypeDrug[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onEdit: (category: TypeDrug) => void;
    onDelete: (category: TypeDrug) => void;
}

export function CategoryTable({
    categories,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onEdit,
    onDelete,
}: CategoryTableProps) {
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 border-collapse">
                    {/* Header disamakan dengan DrugTable */}
                    <thead className="bg-[#eef2f6] text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                        <tr>
                            <th className="py-3 px-4 w-16 text-center">No</th>
                            <th className="py-3 px-4">Category Name</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center py-8 text-slate-400">
                                    <FolderKanban className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                                    No drug category data available.
                                </td>
                            </tr>
                        ) : (
                            categories.map((category, index) => {
                                const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                                const categoryId = category.id ?? category.id_jenis;

                                return (
                                    <tr
                                        key={categoryId || index}
                                        className="hover:bg-slate-50/80 transition-colors"
                                    >
                                        <td className="py-3.5 px-4 text-center font-medium text-slate-500 align-middle">
                                            {rowNumber}
                                        </td>
                                        <td className="py-3.5 px-4 font-semibold text-slate-900 align-middle">
                                            {category.nama_jenis}
                                        </td>
                                        <td className="py-3.5 px-4 text-right space-x-1 align-middle">
                                            {/* Tombol Edit disamakan warna bawaannya */}
                                            <button
                                                type="button"
                                                onClick={() => onEdit(category)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Category"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            {/* Tombol Delete diselaraskan styling-nya */}
                                            <button
                                                type="button"
                                                onClick={() => onDelete(category)}
                                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Delete Category"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer disamakan presisi */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
                <div>
                    Showing{" "}
                    <span className="font-semibold text-slate-800">{startItem}</span> -{" "}
                    <span className="font-semibold text-slate-800">{endItem}</span> of{" "}
                    <span className="font-semibold text-slate-800">{totalItems}</span>{" "}
                    entries
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        title="Previous Page"
                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold shadow-sm select-none">
                        {currentPage} / {totalPages || 1}
                    </span>

                    <button
                        type="button"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages || totalPages === 0}
                        title="Next Page"
                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}