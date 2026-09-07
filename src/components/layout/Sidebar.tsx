import { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Pill,
    Tags,
    AlertTriangle,
    FileSpreadsheet,
    Users,
    Settings,
    ChevronDown,
    LogOut,
    ClockAlert,
} from 'lucide-react';

import type { NavItem } from '../../types/navigation.types';
import { authService } from '../../services/authService';
import { hasPermission, type RoutePermission } from '../../utils/role';
import { useAlerts } from '../../features/drugs/hooks/useAlerts';

const ALL_NAV_ITEMS: NavItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: '/dashboard',
        permission: 'dashboard',
    },
    {
        id: 'drug-management',
        label: 'Drug Management',
        icon: Pill,
        path: '/drug-management',
        permission: 'drug-management',
    },
    {
        id: 'drug-categories',
        label: 'Drug Categories',
        icon: Tags,
        path: '/drug-categories',
        permission: 'drug-categories',
    },
    {
        id: 'stock-alerts',
        label: 'Notifications & Stock',
        icon: AlertTriangle,
        badge: 5,
        badgeColor: 'bg-amber-100 text-amber-700',
        permission: 'stock-alerts',
        children: [
            {
                id: 'low-stock',
                label: 'Low Stock',
                badge: 3,
                path: '/stock-alerts/low-stock',
            },
            {
                id: 'expiring-soon',
                label: 'Expiring Soon',
                badge: 2,
                path: '/stock-alerts/expiring-soon',
                icon: ClockAlert,
            },
        ],
    },
    {
        id: 'reports',
        label: 'Reports & Export',
        icon: FileSpreadsheet,
        path: '/reports',
        permission: 'reports',
    },
    {
        id: 'user-management',
        label: 'User Management',
        icon: Users,
        path: '/users',
        permission: 'user-management',
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        path: '/settings',
        permission: 'settings',
    },
];

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export default function Sidebar() {
    const [isStockOpen, setIsStockOpen] = useState<boolean>(true);
    const user = authService.getCurrentUser();
    const { lowStock, expiring } = useAlerts();

    const navItems = useMemo(() => {
        return ALL_NAV_ITEMS
            .filter((item) => {
                if (!item.permission) return true;
                return hasPermission(item.permission as RoutePermission);
            })
            .map((item) => {
                if (item.id !== 'stock-alerts') return item;
                return {
                    ...item,
                    badge: lowStock.length + expiring.length,
                    children: item.children?.map((sub) =>
                        sub.id === 'low-stock'
                            ? { ...sub, badge: lowStock.length }
                            : sub.id === 'expiring-soon'
                                ? { ...sub, badge: expiring.length }
                                : sub
                    ),
                };
            });
    }, [lowStock.length, expiring.length]);

    return (
        <aside className="hidden md:flex w-64 h-full bg-white border-r border-slate-200 flex-col shrink-0 justify-between p-4">
            <div>
                <div className="px-3 py-2 mb-4">
                    <h1 className="text-2xl font-bold text-blue-600 tracking-tight">Medix</h1>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Pharmacy Management</p>
                </div>

                {/* Navigation List */}
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const hasChildren = item.children && item.children.length > 0;

                        return (
                            <div key={item.id} className="w-full">
                                {/* Main Menu Item */}
                                {hasChildren ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsStockOpen(!isStockOpen)}
                                        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all duration-150"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Icon className="w-5 h-5 text-slate-500" />
                                            <span>{item.label}</span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {item.badge && (
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform duration-200 ${isStockOpen ? 'rotate-180' : ''} text-slate-400`}
                                            />
                                        </div>
                                    </button>
                                ) : (
                                    <NavLink
                                        to={item.path || '#'}
                                        className={({ isActive }) =>
                                            `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <div className="flex items-center space-x-3">
                                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                                                    <span>{item.label}</span>
                                                </div>

                                                {item.badge && (
                                                    <span
                                                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-200 text-slate-700'
                                                        }`}
                                                    >
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                )}

                                {/* Sub-menu (Low Stock & Expiring Soon) */}
                                {hasChildren && isStockOpen && (
                                    <div className="ml-8 mt-1 space-y-1 border-l-2 border-slate-200 pl-2">
                                        {item.children?.map((sub) => (
                                            <NavLink
                                                key={sub.id}
                                                to={sub.path || '#'}
                                                className={({ isActive }) =>
                                                    `w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${isActive
                                                        ? 'bg-blue-50 text-blue-600 font-bold'
                                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                                    }`
                                                }
                                            >
                                                <span className="flex items-center space-x-2">
                                                    {sub.id === 'expiring-soon' && <ClockAlert className="w-3.5 h-3.5" />}
                                                    <span>{sub.label}</span>
                                                </span>
                                                {sub.badge && (
                                                    <span
                                                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${sub.id === 'low-stock' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                                                        }`}
                                                    >
                                                        {sub.badge}
                                                    </span>
                                                )}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section: User Info & Logout */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center space-x-3 px-2">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm border border-blue-200">
                        {user ? getInitials(user.nama_user) : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                            {user?.nama_user || 'User'}
                        </p>
                        <p className="text-xs text-slate-400 truncate capitalize">
                            {user?.role || 'Unknown'}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => authService.logout()}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
