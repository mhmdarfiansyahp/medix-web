import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Akses Ditolak</h1>
                <p className="text-slate-500 mb-6">
                    Anda tidak memiliki izin untuk mengakses halaman ini.
                </p>
                <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
                >
                    Kembali ke Dashboard
                </Link>
            </div>
        </div>
    );
}
