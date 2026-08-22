import { Bell } from 'lucide-react';

export default function Navbar() {
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
          className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Indicator Dot (Merah / Badge jika ada notifikasi aktif) */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

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