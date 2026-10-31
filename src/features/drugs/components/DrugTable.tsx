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
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (drug: Drug) => void;
  onToggleStatus?: (drug: Drug) => Promise<void | Drug>;
  isLoading?: boolean;
}

export function DrugTable({
  drugs,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onEdit,
  onToggleStatus,
  isLoading,
}: DrugTableProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

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
            <tr>
              <th className="py-3 px-4">SKU / BARCODE</th>
              <th className="py-3 px-4">NAME</th>
              <th className="py-3 px-4">BRAND</th>
              <th className="py-3 px-4">CATEGORY</th>
              <th className="py-3 px-4 text-right">STOCK LEVEL</th>
              <th className="py-3 px-4 text-right">PRICE</th>
              <th className="py-3 px-4">EXPIRY DATE</th>
              <th className="py-3 px-4 text-center">STATUS</th>
              <th className="py-3 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {drugs.length > 0 ? (
              drugs.map((drug, index) => {
                const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                const stok = drug.stok;
                const minStok = drug.stok_minimum ?? 10;
                const isLow = stok <= minStok && stok > 0;
                const isOut = stok === 0;
                const isActive = Number(drug.status) === 1;
                const isExpired = drug.tgl_kadaluarsa ? new Date(drug.tgl_kadaluarsa) < new Date() : false;

                return (
                  <tr key={drug.id_obat} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-xs text-slate-700">{drug.barcode || "N/A"}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{drug.nama_obat}</td>
                    <td className="py-3.5 px-4 text-slate-600">{drug.merk_obat || "-"}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{drug.jenis_obat?.nama_jenis || "General"}</td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-800">
                      <span className={cn(isOut && "text-rose-600 font-bold")}>{stok}</span>
                      {isLow && <AlertTriangle className="w-4 h-4 text-amber-500 inline-block ml-1" />}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-800">{formatCurrency(drug.harga)}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">{drug.tgl_kadaluarsa || "-"}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={cn("inline-block text-xs font-semibold px-2.5 py-0.5 rounded-md", isActive ? "bg-emerald-100/80 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(drug)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Medication"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isActive}
                          onClick={() => !isExpired && onToggleStatus?.(drug)}
                          title={isExpired ? "Medication is expired" : (isActive ? "Deactivate Medication" : "Activate Medication")}
                          className={cn(
                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                            isActive ? "bg-emerald-500" : "bg-slate-300",
                            isExpired && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <span className="sr-only">Toggle Active Status</span>
                          <span className={cn("pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out", isActive ? "translate-x-4" : "translate-x-0")} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-8 text-slate-400">
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
          <span className="font-semibold text-slate-800">{totalItems}</span>{" "}
          entries
        </div>

        {totalPages > 1 && (
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
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              title="Next Page"
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
