import { Search } from 'lucide-react';

interface CategoryFilterBarProps {
    search: string;
    onSearchChange: (value: string) => void;
}

export function CategoryFilterBar({ search, onSearchChange }: CategoryFilterBarProps) {
    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search categories by name..."
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                />
            </div>
        </div>
    );
}