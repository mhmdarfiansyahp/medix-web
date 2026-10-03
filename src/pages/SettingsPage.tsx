import { useState } from 'react';
import { Shield, Bell, Image, User as UserIcon } from 'lucide-react';
import { cn } from '../utils/utils';
import { authService } from '../services/authService';
import { useProfile } from '../features/users/hooks/useProfile';
import { showSuccessToast, showErrorToast } from '../utils/sweetalert';
import type { User } from '../features/users/types/user.types';

export default function SettingsPage() {
    const { profile, loading, error, refetch, updateProfile } = useProfile();
    const user = authService.getCurrentUser();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: profile?.nama_user || '',
        phone: profile?.no_telp || '',
    });
    const [photoPreview, setPhotoPreview] = useState<string | null>(profile?.foto || null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setPhotoPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(false);

        const payload: Partial<User> = {
            nama_user: formData.name.trim(),
            no_telp: formData.phone.trim(),
            foto: photoPreview,
        };

        try {
            await updateProfile(payload);
            refetch();
            showSuccessToast('Profil berhasil diperbarui.');
        } catch (err: unknown) {
            showErrorToast(err instanceof Error ? err.message : 'Gagal memperbarui profil.');
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-12 text-center text-sm text-slate-400">
                Memuat data profil...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl border border-rose-100 text-sm">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Manage your account and preferences.</p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className={cn(
                        'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm',
                        isEditing ? 'text-rose-600 border-rose-500' : 'text-slate-500'
                    )}
                >
                    {isEditing ? 'Selesai' : 'Edit Profil'}
                </button>
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Budi Santoso"
                                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Telepon</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="e.g. 081234567890"
                                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                pattern="^(0|62)?8[1-9][0-9]{6,9}$"
                                title="Masukkan nomor telepon Indonesia yang valid (misal: 081234567890)"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Foto Profil</label>
                        <div className="flex items-center gap-3">
                            {photoPreview ? (
                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100">
                                    <img
                                        src={photoPreview}
                                        alt="Foto profil"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                    <Image className="w-5 h-5" />
                                </div>
                            )}

                            <input
                                type="file"
                                name="photo"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()
                                }
                                className="px-3.5 py-2 text-sm text-rose-600 hover:text-rose-700 rounded-lg transition-colors font-medium"
                            >
                                Ganti Foto
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm shadow-rose-500/20 disabled:opacity-50 cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                <UserIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Profile</h3>
                                <p className="text-xs text-slate-500">Your account info</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Name</span>
                                <span className="font-medium text-slate-800">{user?.nama_user || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Role</span>
                                <span className="font-medium text-slate-800 capitalize">{user?.role || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Status</span>
                                <span className="font-medium text-emerald-600">Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Security</h3>
                                <p className="text-xs text-slate-500">Account protection</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-sm text-slate-600">
                                Your account is secured with session-based authentication.
                            </p>
                            <p className="text-xs text-slate-400">
                                Password management available soon.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Notifications</h3>
                                <p className="text-xs text-slate-500">Alert preferences</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Low stock alerts</span>
                                <span className="text-xs font-medium text-emerald-600">Enabled</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Expiry warnings</span>
                                <span className="text-xs font-medium text-emerald-600">Enabled</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}