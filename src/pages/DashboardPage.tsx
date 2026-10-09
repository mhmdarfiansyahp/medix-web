// src/features/dashboard/pages/DashboardPage.tsx
import { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Receipt,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { cn, formatCurrency } from "../utils/utils";
import { useAlerts } from "../features/drugs/hooks/useAlerts";
import { useReports } from "../features/reports/hooks/useReports";

// Import komponen-komponen Dashboard
import { DashboardHeader } from "../features/dashboard/components/DashboardHeader";
import { MedicationTable } from "../features/dashboard/components/MedicationTable";
import { SalesChart } from "../features/dashboard/components/SalesChart";

function Sparkline({
  values,
  className,
}: {
  values: number[];
  className?: string;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const d = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 26 - ((v - min) / range) * 22;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox="0 0 100 28"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function DashboardPage() {
  const [currentUserRole] = useState<"ADMIN" | "OWNER">("ADMIN");
  const { lowStock, expiring, summary } = useAlerts();
  const { salesSummary, drugRanking, fetchSalesSummary, fetchDrugRanking } =
    useReports();

  useEffect(() => {
    fetchSalesSummary({ group_by: "monthly" });
    fetchDrugRanking();
  }, [fetchSalesSummary, fetchDrugRanking]);

  const sparkValues = useMemo(
    () => (salesSummary?.chart_data ?? []).map((d) => d.total_penjualan),
    [salesSummary]
  );

  const revenueTrend = useMemo(() => {
    const chart = salesSummary?.chart_data ?? [];
    if (chart.length < 2) return null;
    const prev = chart[chart.length - 2].total_penjualan;
    const curr = chart[chart.length - 1].total_penjualan;
    if (prev <= 0) return null;
    return ((curr - prev) / prev) * 100;
  }, [salesSummary]);

  const dashboardAlerts = [
    ...lowStock.slice(0, 3).map((item) => ({
      id: `low-${item.id_obat}`,
      name: item.nama_obat,
      detail: `${item.stok} / ${item.stok_minimum} units on hand`,
      type: "LOW_STOCK" as const,
      label: "Low stock",
      progress: Math.min(
        100,
        (item.stok / Math.max(item.stok_minimum, 1)) * 100
      ),
    })),
    ...expiring.slice(0, 3).map((item) => ({
      id: `exp-${item.id_obat}`,
      name: item.nama_obat,
      detail: `${item.sisa_hari} days before expiry`,
      type: "EXPIRING" as const,
      label: "Expiring",
      progress: Math.min(100, (item.sisa_hari / 30) * 100),
    })),
  ];

  const totalAlerts = lowStock.length + expiring.length;

  return (
    <div className="space-y-5 pb-10">
      {/* 1. Header & Quick Actions (Di-handle oleh komponen DashboardHeader) */}
      <DashboardHeader role={currentUserRole} />

      {/* 2. Key Metrics — asymmetric: revenue hero + two compact stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <article className="md:col-span-2 relative overflow-hidden rounded-2xl bg-slate-900 px-6 pt-5 pb-10 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <Banknote className="h-3.5 w-3.5" aria-hidden="true" />
                Total Revenue
              </p>
              <p className="mt-2 truncate text-3xl font-semibold tabular-nums tracking-tight text-white">
                {formatCurrency(salesSummary?.total_penjualan ?? 0)}
              </p>
            </div>
            {revenueTrend !== null && (
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums",
                  revenueTrend >= 0
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-rose-500/15 text-rose-400"
                )}
              >
                {revenueTrend >= 0 ? (
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {Math.abs(revenueTrend).toFixed(1)}%
              </span>
            )}
          </div>
          {revenueTrend !== null && (
            <p className="mt-1 text-xs text-slate-400">vs previous period</p>
          )}
          {sparkValues.length >= 2 && (
            <Sparkline
              values={sparkValues}
              className="absolute inset-x-6 bottom-3 h-8 text-emerald-400/60"
            />
          )}
        </article>

        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Transactions
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-slate-900">
                {salesSummary?.total_transaksi ?? 0}
              </p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Receipt className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Invoices recorded in current period
          </p>
        </article>

        <article className="rounded-2xl border border-rose-100 bg-rose-50/60 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-700/80">
                Low Stock
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-rose-950">
                {summary?.total_low_stock ?? 0}
                <span className="ml-1.5 text-sm font-medium text-rose-400">
                  items
                </span>
              </p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
          <a
            href="/stock-alerts/low-stock"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-rose-600 transition-colors hover:text-rose-700"
          >
            Review inventory
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </article>
      </section>

      {/* 3. Chart & Inventory Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SalesChart data={salesSummary?.chart_data ?? []} />

        {/* Inventory Alerts Sidebar */}
        <aside className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                Stock & Expiry Alerts
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                {dashboardAlerts.length} of {totalAlerts} flagged items
              </p>
            </div>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold tabular-nums text-rose-600">
              {totalAlerts}
            </span>
          </div>

          <ul className="flex-1 min-h-0 divide-y divide-slate-100 overflow-y-auto px-5">
            {dashboardAlerts.length === 0 ? (
              <li className="py-8 text-center text-sm text-slate-400">
                No alerts right now.
              </li>
            ) : (
              dashboardAlerts.map((alert) => {
                const urgent =
                  alert.type === "LOW_STOCK"
                    ? alert.progress < 34
                    : alert.progress < 25;
                return (
                  <li key={alert.id} className="py-3.5">
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                          alert.type === "LOW_STOCK"
                            ? "bg-rose-50 text-rose-500"
                            : "bg-amber-50 text-amber-500"
                        )}
                      >
                        {alert.type === "EXPIRING" ? (
                          <Calendar
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        ) : (
                          <AlertCircle
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="truncate text-[13px] font-semibold text-slate-800">
                            {alert.name}
                          </p>
                          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            {alert.label}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] tabular-nums text-slate-500">
                          {alert.detail}
                        </p>
                        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              urgent
                                ? "bg-rose-500"
                                : alert.type === "LOW_STOCK"
                                ? "bg-rose-400"
                                : "bg-amber-400"
                            )}
                            style={{
                              width: `${Math.max(alert.progress, 4)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>

          <a
            href="/stock-alerts/low-stock"
            className="border-t border-slate-100 px-5 py-3.5 text-center text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            View all alerts ({totalAlerts})
          </a>
        </aside>
      </div>

      {/* 4. TanStack Medication Performance Table */}
      <MedicationTable
        topData={drugRanking?.top_medicines ?? []}
        bottomData={drugRanking?.bottom_medicines ?? []}
        filterParams={{ group_by: "monthly" }}
      />
    </div>
  );
}
