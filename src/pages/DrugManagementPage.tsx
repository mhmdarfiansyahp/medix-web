import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

import { DrugFilterBar } from "../features/drugs/components/DrugFilterBar";
import { DrugTable } from "../features/drugs/components/DrugTable";
import { AddMedicationModal } from "../features/dashboard/components/AddMedicationModal";

import { showSuccessToast, showErrorToast } from "../utils/sweetalert";
import { useMedicines } from "../features/drugs/hooks/useMedicines";
import { useTypeDrugs } from "../features/drugs/hooks/useTypeDrugs";
import type { Drug } from "../features/drugs/types/Drug.types";

export default function DrugManagementPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStockStatus, setSelectedStockStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDrugForEdit, setSelectedDrugForEdit] = useState<Drug | null>(
    null
  );

  const { items: categories, loading: categoriesLoading } = useTypeDrugs();
  const {
    items: drugs,
    loading: drugsLoading,
    setParams,
    toggleStatus,
    refetch,
  } = useMedicines({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    setParams({
      page: currentPage,
      limit: 10,
      search: search.trim() || undefined,
      jenis_obat_id: selectedCategory ? Number(selectedCategory) : undefined,
      stock_status:
        selectedStockStatus && selectedStockStatus !== "all"
          ? selectedStockStatus
          : undefined,
    });
  }, [search, selectedCategory, selectedStockStatus, currentPage, setParams]);

  const handleEdit = (drug: Drug) => {
    setSelectedDrugForEdit(drug);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (drug: Drug) => {
    const isCurrentlyActive = Number(drug.status) === 1;
    const nextStatus = !isCurrentlyActive;
    const actionText = nextStatus ? "activated" : "deactivated";

    try {
      await toggleStatus(drug.id_obat, nextStatus);
      showSuccessToast(`Medication "${drug.nama_obat}" has been successfully ${actionText}.`);
    } catch (error: any) {
      showErrorToast(error?.message || `Failed to ${nextStatus ? "activate" : "deactivate"} medication data.`);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleStockStatusChange = (value: string) => {
    setSelectedStockStatus(value);
    setCurrentPage(1);
  };

  const handleModalSuccess = () => {
    refetch();
  };

  const formattedCategories = categories.map((cat) => ({
    id_jenis: cat.id_jenis ?? 0,
    nama_jenis: cat.nama_jenis || "",
  }));

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Medicine Inventory
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage master medication data, stock levels, and pricing.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedDrugForEdit(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Medication
        </button>
      </div>

      <DrugFilterBar
        search={search}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedStockStatus={selectedStockStatus}
        onStockStatusChange={handleStockStatusChange}
        categories={formattedCategories}
      />

      <DrugTable
        drugs={drugs}
        isLoading={drugsLoading || categoriesLoading}
        currentPage={currentPage}
        totalPages={1}
        totalItems={drugs.length}
        itemsPerPage={10}
        onPageChange={(page) => setCurrentPage(page)}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />

      <AddMedicationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDrugForEdit(null);
        }}
        categories={formattedCategories}
        initialData={selectedDrugForEdit}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}