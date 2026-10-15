export function DashboardHeader({ role }: { role: 'ADMIN' | 'OWNER' }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Welcome back, {role === 'ADMIN' ? 'Administrator' : 'Pharmacy Owner'}.
                </p>
            </div>
            {role === 'OWNER' && (
                <div className="hidden md:block bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                    <p className="text-xs font-medium text-emerald-700">Today's Summary</p>
                    <p className="text-lg font-bold text-emerald-900">
                        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                </div>
            )}
        </div>
    );
}