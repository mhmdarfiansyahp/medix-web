import { Bell, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useAlerts } from '../../features/drugs/hooks/useAlerts';
import type { LowStockDrug, ExpiringDrug } from '../../features/drugs/types/Drug.types';

export default function Navbar() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { lowStock, expiring, summary, loading } = useAlerts();

  const hasNotifications = summary?.total_low_stock || summary?.total_expiring;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        {/* Kosong atau bisa diisi judul halaman/breadcrumb */}
      </div>

      {/* Sisi Kanan Navbar: Notifikasi & Profile Avatar */}
      <div className="flex items-center space-x-5">
        {/* Notification Bell Icon */}
        <button
          type="button"
          className={`relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none ${isNotificationsOpen ? 'bg-slate-100' : ''}`}
          aria-label="View notifications"
          onClick={() => {
            console.log('Bell clicked, notifications open:', isNotificationsOpen);
            setIsNotificationsOpen(!isNotificationsOpen);
          }}
        >
          <Bell className="w-5 h-5" />
          {/* Indicator Dot (Merah / Badge jika ada notifikasi aktif) */}
          {hasNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* Date Display */}
        <div className="flex items-center gap-1.5 text-sm text-slate-500 px-3 py-1.5 rounded-full bg-slate-50">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>

        {/* Notification Dropdown */}
        {isNotificationsOpen && (
          <div className="absolute right-20 top-16 mt-2 w-80 bg-white border border-slate-200 rounded-md shadow-lg z-20">
            <div className="py-2">
              <div className="px-4 py-2 text-sm text-slate-700 font-medium border-b border-slate-200">
                Notifications
              </div>
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="px-4 py-3 text-sm text-slate-500">Loading...</div>
                ) : (
                  <>
                    {lowStock.length > 0 && (
                      <div className="border-b border-slate-100">
                        <div className="px-4 py-2 text-xs font-semibold text-rose-600 uppercase">
                          Low Stock ({lowStock.length})
                        </div>
                        {lowStock.map((item: LowStockDrug) => (
                          <div key={item.id_obat} className="px-4 py-2 text-sm text-slate-700">
                            <span className="font-medium">{item.nama_obat}</span>
                            <span className="text-slate-500"> - Stock: {item.stok} (Min: {item.stok_minimum})</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {expiring.length > 0 && (
                      <div className="border-b border-slate-100">
                        <div className="px-4 py-2 text-xs font-semibold text-amber-600 uppercase">
                          Expiring Soon ({expiring.length})
                        </div>
                        {expiring.map((item: ExpiringDrug) => (
                          <div key={item.id_obat} className="px-4 py-2 text-sm text-slate-700">
                            <span className="font-medium">{item.nama_obat}</span>
                            <span className="text-slate-500"> - {item.sisa_hari} days left</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {lowStock.length === 0 && expiring.length === 0 && (
                      <div className="px-4 py-3 text-sm text-slate-600">
                        No notifications
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* User Profile Avatar */}
        <button
          type="button"
          className="relative flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <img
            className="w-9 h-9 rounded-full object-cover border border-slate-200"
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop"
            alt="User profile"
          />
        </button>
      </div>
    </header>
  );
}