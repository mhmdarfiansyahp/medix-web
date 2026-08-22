import { useState } from 'react';
import { useReactTable, flexRender } from '@tanstack/react-table';
import {
    createColumnHelper,
    getCoreRowModel,
} from '@tanstack/table-core'; // Core utilities di v9
import { Filter, TrendingDown, TrendingUp } from 'lucide-react';
import { cn, formatCurrency } from '../../../utils/utils';
import type { MedicationPerformance } from '../types';
interface MedicationTableProps {
    topData: MedicationPerformance[];
    bottomData: MedicationPerformance[];
}

const columnHelper = createColumnHelper<MedicationPerformance>();

const columns = [
    columnHelper.accessor('name', {
        header: 'Medication Name',
        cell: (info) => (
            <span className="font-semibold text-blue-600 hover:underline cursor-pointer">
                {info.getValue()}
            </span>
        ),
    }),
    columnHelper.accessor('sku', {
        header: 'SKU / Batch',
        cell: (info) => (
            <span className="text-slate-500 font-mono text-xs">{info.getValue()}</span>
        ),
    }),
    columnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => <span className="font-medium text-slate-700">{info.getValue()}</span>,
    }),
    columnHelper.accessor('unitsSold', {
        header: () => <div className="text-right">Units Sold</div>,
        cell: (info) => (
            <div className="text-right font-semibold text-slate-800">
                {info.getValue().toLocaleString('en-US')}
            </div>
        ),
    }),
    columnHelper.accessor('revenue', {
        header: () => <div className="text-right">Total Revenue</div>,
        cell: (info) => (
            <div className="text-right font-bold text-slate-900">
                {formatCurrency(info.getValue())}
            </div>
        ),
    }),
    columnHelper.accessor('status', {
        header: () => <div className="text-center">Stock Status</div>,
        cell: (info) => {
            const status = info.getValue();
            return (
                <div className="text-center">
                    <span
                        className={cn(
                            'inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase',
                            status === 'IN STOCK' && 'bg-emerald-100 text-emerald-700',
                            status === 'LOW STOCK' && 'bg-amber-100 text-amber-700',
                            status === 'OUT OF STOCK' && 'bg-rose-100 text-rose-700'
                        )}>
                        {status}
                    </span>
                </div>
            );
        },
    }),
];

export function MedicationTable({ topData, bottomData }: MedicationTableProps) {
    const [activeTab, setActiveTab] = useState<'top' | 'bottom'>('top');

    const data = activeTab === 'top' ? topData : bottomData;

    // In TanStack Table v9, `useReactTable` core configuration remains declarative
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Medication Performance</h3>
                    <p className="text-xs text-slate-500">
                        Overview of top and bottom selling medications by volume
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab('top')}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                                activeTab === 'top'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                            )}
                        >
                            <TrendingUp className="w-3.5 h-3.5" />
                            Top Selling
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('bottom')}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                                activeTab === 'bottom'
                                    ? 'bg-white text-rose-600 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                            )}
                        >
                            <TrendingDown className="w-3.5 h-3.5" />
                            Bottom Selling
                        </button>
                    </div>

                    <button type="button" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Table Element */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="py-3.5 px-6">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="py-4 px-6">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Summary */}
            <div className="p-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>
                    Showing {data.length} entries ({activeTab === 'top' ? 'Top Performance' : 'Low Demand'})
                </span>
                <div className="flex gap-1">
                    <button
                        type="button"
                        className="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-50"
                        disabled
                    >
                        Previous
                    </button>
                    <button type="button" className="px-3 py-1 border rounded hover:bg-slate-50">Next</button>
                </div>
            </div>
        </div>
    );
}