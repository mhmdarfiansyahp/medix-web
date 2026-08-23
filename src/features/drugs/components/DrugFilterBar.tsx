import { Search } from 'lucide-react';
import type { DrugCategory } from '../types/Drug.types';

interface DrugFilterBarProps {
    search: string;
    onSearchChange: (value: string) => void;
    selectedCategory: string;
    onCategoryChange: (value: string) => void;
    selectedStockStatus: string;
    onStockStatusChange: (value: string) => void;
    categories: DrugCategory[];
}

export function DrugFilterBar({
    search,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    selectedStockStatus,
    onStockStatusChange,
    categories
}: DrugFilterBarProps) {
    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search medication, SKU, or batch..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-700 transition-all"
                    />
                </div>

                <div className="w-full md:w-56">
                    <select
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium cursor-pointer"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id_jenis} value={cat.id_jenis}>
                                {cat.nama_jenis}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full md:w-48">
                    <select
                        value={selectedStockStatus}
                        onChange={(e) => onStockStatusChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium cursor-pointer"
                    >
                        <option value="">Stock Status</option>
                        <option value="all">All Stock</option>
                        <option value="low">Low Stock</option>
                        <option value="out">Out of Stock</option>
                    </select>
                </div>
            </div>
        </div>
    );
}