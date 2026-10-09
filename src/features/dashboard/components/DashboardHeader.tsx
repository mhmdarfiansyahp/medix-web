export function DashboardHeader({ role }: { role: 'ADMIN' | 'OWNER' }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Welcome back, {role === 'ADMIN' ? 'Administrator' : 'Pharmacy Owner'}.
                </p>
            </div>
        </div>
    );
}