import { useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Edit2,
  AlertTriangle,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn, formatCurrency } from "../../../utils/utils";
import type { Drug } from "../types/Drug.types";

interface DrugTableProps {
  drugs: Drug[];
  onEdit: (drug: Drug) => void;
  onToggleStatus?: (drug: Drug) => Promise<void | Drug>;
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

const columnHelper = createColumnHelper<Drug>();

export function DrugTable({
  drugs,
  onEdit,
  onToggleStatus,
  isLoading,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
}: DrugTableProps) {
  const columns = useMemo(
    () => [
      columnHelper.accessor("barcode", {
        header: "SKU / BARCODE",
        cell: (info) => (
          <span className="font-medium text-xs text-slate-700">
            {info.getValue() || "N/A"}
          </span>
        ),
      }),
      columnHelper.accessor("nama_obat", {
        header: "NAME",
        cell: (info) => (
          <span className="font-semibold text-slate-900">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("merk_obat", {
        header: "BRAND",
        cell: (info) => (
          <span className="text-slate-600">{info.getValue() || "-"}</span>
        ),
      }),
      columnHelper.accessor("jenis_obat.nama_jenis", {
        header: "CATEGORY",
        cell: (info) => (
          <span className="text-slate-700 font-medium">
            {info.getValue() || "General"}
          </span>
        ),
      }),
      columnHelper.accessor("stok", {
        header: () => <div className="text-right">STOCK LEVEL</div>,
        cell: (info) => {
          const stok = info.getValue();
          const minStok = info.row.original.stok_minimum ?? 10;
          const isLow = stok <= minStok && stok > 0;
          const isOut = stok === 0;

          return (
            <div className="flex items-center justify-end gap-1.5 font-medium text-slate-800">
              <span className={cn(isOut && "text-rose-600 font-bold")}>
                {stok}
              </span>
              {isLow && (
                <AlertTriangle className="w-4 h-4 text-amber-500 inline-block" />
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor("harga", {
        header: () => <div className="text-right">PRICE</div>,
        cell: (info) => (
          <div className="text-right font-medium text-slate-800">
            {formatCurrency(info.getValue())}
          </div>
        ),
      }),
      columnHelper.accessor("tgl_kadaluarsa", {
        header: "EXPIRY DATE",
        cell: (info) => {
          const rawDate = info.getValue();
          if (!rawDate) return <span className="text-slate-400">-</span>;

          return (
            <span className="text-xs text-slate-600 font-medium">
              {rawDate}
            </span>
          );
        },
      }),
      columnHelper.accessor("status", {
        header: () => <div className="text-center">STATUS</div>,
        cell: (info) => {
          const isActive = info.getValue() === 1;
          return (
            <div className="text-center">
              <span
                className={cn(
                  "inline-block text-xs font-semibold px-2.5 py-0.5 rounded-md",
                  isActive
                    ? "bg-emerald-100/80 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: () => <div className="text-right">ACTION</div>,
        cell: (info) => {
          const drug = info.row.original;
          const isActive = Number(drug.status) === 1;
          return (
            <div className="flex items-center justify-end gap-2">
              {/* Tombol Edit */}
              <button
                type="button"
                onClick={() => onEdit(drug)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit Data Obat"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              {/* Switch Toggle Status setelah Edit (Pengganti Delete) */}
              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                onClick={() => onToggleStatus?.(drug)}
                title={isActive ? "Nonaktifkan Obat" : "Aktifkan Obat"}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  isActive ? "bg-emerald-500" : "bg-slate-300"
                )}
              >
                <span className="sr-only">Toggle Active Status</span>
                <span
                  className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                    isActive ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          );
        },
      }),
    ],
    [onEdit, onToggleStatus]
  );

  const table = useReactTable({
    data: drugs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(
    currentPage * itemsPerPage,
    totalItems || drugs.length
  );

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Loading medication data...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#eef2f6] text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="py-3 px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3.5 px-4 align-middle">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-8 text-slate-400"
                >
                  <FolderKanban className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  No medication records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
        <div>
          Showing{" "}
          <span className="font-semibold text-slate-800">{startItem}</span> -{" "}
          <span className="font-semibold text-slate-800">{endItem}</span> of{" "}
          <span className="font-semibold text-slate-800">
            {totalItems || drugs.length}
          </span>{" "}
          entries
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
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
            onClick={() => onPageChange?.(currentPage + 1)}
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
