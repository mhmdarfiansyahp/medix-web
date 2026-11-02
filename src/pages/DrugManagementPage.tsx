import { useState, useMemo } from "react";
import { Plus } from "lucide-react";

import { DrugFilterBar } from "../features/drugs/components/DrugFilterBar";
import { DrugTable } from "../features/drugs/components/DrugTable";
import { AddMedicationModal } from "../features/dashboard/components/AddMedicationModal";

import { showSuccessToast, showErrorToast, showConfirmDialog } from "../utils/sweetalert";
import { useMedicines } from "../features/drugs/hooks/useMedicines";
import { useTypeDrugs } from "../features/drugs/hooks/useTypeDrugs";
import type { Drug } from "../features/drugs/types/Drug.types";

const ITEMS_PER_PAGE = 10;

export default function DrugManagementPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStockStatus, setSelectedStockStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDrugForEdit, setSelectedDrugForEdit] = useState<Drug | null>(
    null
  );

  const { items: categories, loading: categoriesLoading } = useTypeDrugs();
  const {
    items: allDrugs,
    loading: drugsLoading,
    toggleStatus,
    refetch,
  } = useMedicines();

  const filteredDrugs = useMemo(() => {
    return allDrugs.filter((drug) => {
      const matchSearch =
        !search ||
        drug.nama_obat.toLowerCase().includes(search.toLowerCase()) ||
        drug.barcode?.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        !selectedCategory || String(drug.jenis_obat_id) === selectedCategory;
      const matchStatus = !selectedStatus || String(drug.status) === selectedStatus;

      let matchStock = true;
      if (selectedStockStatus === "low") {
        matchStock = drug.stok <= (drug.stok_minimum ?? 10) && drug.stok > 0;
      } else if (selectedStockStatus === "out") {
        matchStock = drug.stok === 0;
      }

      return matchSearch && matchCategory && matchStatus && matchStock;
    });
  }, [allDrugs, search, selectedCategory, selectedStockStatus, selectedStatus]);

  const totalPages = Math.ceil(filteredDrugs.length / ITEMS_PER_PAGE);
  const paginatedDrugs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDrugs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDrugs, currentPage]);

  const handleEdit = (drug: Drug) => {
    setSelectedDrugForEdit(drug);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (drug: Drug) => {
    const isCurrentlyActive = Number(drug.status) === 1;
    const nextStatus = !isCurrentlyActive;
    const actionText = nextStatus ? "activated" : "deactivated";

    if (isCurrentlyActive) {
      const confirmed = await showConfirmDialog({
        title: "Deactivate Medication?",
        text: `Are you sure you want to deactivate "${drug.nama_obat}"? This medication will be marked as inactive.`,
        confirmButtonText: "Yes, deactivate",
        cancelButtonText: "Cancel",
        isDanger: true,
      });
      if (!confirmed) return;
    }

    try {
      await toggleStatus(drug.id_obat, nextStatus);
      showSuccessToast(`Medication "${drug.nama_obat}" has been successfully ${actionText}.`);
    } catch (error: unknown) {
      showErrorToast(
        error instanceof Error
          ? error.message
          : `Failed to ${nextStatus ? "activate" : "deactivate"} medication data.`
      );
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

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
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
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        categories={formattedCategories}
      />

      <DrugTable
        drugs={paginatedDrugs}
        isLoading={drugsLoading || categoriesLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredDrugs.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
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
