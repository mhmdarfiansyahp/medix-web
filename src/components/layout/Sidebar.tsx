import { useState, useMemo, useEffect } from 'react';
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
    ShoppingCart,
} from 'lucide-react';

import type { NavItem } from '../../types/navigation.types';
import { authService } from '../../services/authService';
import { hasPermission, type RoutePermission } from '../../utils/role';
import { useAlerts } from '../../features/drugs/hooks/useAlerts';

const SIDEBAR_COLLAPSED_KEY = 'medix_sidebar_collapsed';

const ALL_NAV_ITEMS: NavItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: '/dashboard',
        permission: 'dashboard',
    },
    {
        id: 'transactions',
        label: 'Transactions',
        icon: ShoppingCart,
        path: '/transactions',
        permission: 'transactions',
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
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
        const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
        return saved ? JSON.parse(saved) : false;
    });
    const user = authService.getCurrentUser();
    const { lowStock, expiring } = useAlerts();

    useEffect(() => {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(isSidebarCollapsed));
    }, [isSidebarCollapsed]);

    // Close stock submenu when sidebar collapses
    useEffect(() => {
        if (isSidebarCollapsed) {
            setIsStockOpen(false);
        }
    }, [isSidebarCollapsed]);

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
        <aside
            className={`hidden md:flex h-full bg-white border-r border-slate-200 flex-col shrink-0 justify-between transition-all duration-300 overflow-x-hidden ${
                isSidebarCollapsed ? 'w-20 p-3' : 'w-64 p-4'
            }`}
        >
            <div className="flex-1 flex flex-col min-h-0">
                {/* Header Section */}
                <div
                    className={`px-2 py-2 mb-4 flex items-center ${
                        isSidebarCollapsed ? 'justify-center' : 'justify-between'
                    }`}
                >
                    {!isSidebarCollapsed && (
                        <div className="overflow-hidden">
                            <h1 className="text-2xl font-bold text-blue-600 tracking-tight whitespace-nowrap">Medix</h1>
                            <p className="text-xs font-medium text-slate-500 mt-0.5 whitespace-nowrap">Pharmacy Management</p>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
                        aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <ChevronDown
                            className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${
                                isSidebarCollapsed ? '-rotate-90' : 'rotate-90'
                            }`}
                        />
                    </button>
                </div>

                {/* Navigation List */}
                <nav className="space-y-1 flex-1 overflow-y-auto overflow-x-hidden pr-0.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const hasChildren = item.children && item.children.length > 0;

                        return (
                            <div key={item.id} className="w-full relative group">
                                {/* Main Menu Item */}
                                {hasChildren ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsStockOpen(!isStockOpen)}
                                        className={`w-full flex items-center ${
                                            isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'
                                        } py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all duration-150 relative`}
                                    >
                                        <div className="flex items-center space-x-3 shrink-0">
                                            <Icon className="w-5 h-5 text-slate-500 shrink-0" />
                                            {!isSidebarCollapsed && (
                                                <span className="whitespace-nowrap truncate">{item.label}</span>
                                            )}
                                        </div>

                                        {!isSidebarCollapsed && (
                                            <div className="flex items-center space-x-2 shrink-0">
                                                {Boolean(item.badge) && (
                                                    <span
                                                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                                            item.badgeColor || 'bg-slate-200 text-slate-700'
                                                        }`}
                                                    >
                                                        {item.badge}
                                                    </span>
                                                )}
                                                <ChevronDown
                                                    className={`w-4 h-4 transition-transform duration-200 ${
                                                        isStockOpen ? 'rotate-180' : ''
                                                    } text-slate-400`}
                                                />
                                            </div>
                                        )}

                                        {/* Notification badge indicator on collapsed state */}
                                        {isSidebarCollapsed && Boolean(item.badge) && (
                                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
                                        )}
                                    </button>
                                ) : (
                                    <NavLink
                                        to={item.path || '#'}
                                        className={({ isActive }) =>
                                            `w-full flex items-center ${
                                                isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'
                                            } py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                                                isActive
                                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <div className="flex items-center space-x-3 shrink-0">
                                                <Icon
                                                    className={`w-5 h-5 shrink-0 ${
                                                        isActive ? 'text-white' : 'text-slate-500'
                                                    }`}
                                                />
                                                {!isSidebarCollapsed && (
                                                    <span className="whitespace-nowrap truncate">{item.label}</span>
                                                )}
                                            </div>
                                        )}
                                    </NavLink>
                                )}

                                {/* Collapsed Tooltip Hover */}
                                {isSidebarCollapsed && (
                                    <div className="fixed left-20 ml-2 px-2.5 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                                        {item.label}
                                    </div>
                                )}

                                {/* Sub-menu (Low Stock & Expiring Soon) */}
                                {!isSidebarCollapsed && hasChildren && isStockOpen && (
                                    <div className="ml-6 mt-1 space-y-1 border-l-2 border-slate-200 pl-2">
                                        {item.children?.map((sub) => (
                                            <NavLink
                                                key={sub.id}
                                                to={sub.path || '#'}
                                                className={({ isActive }) =>
                                                    `w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                                                        isActive
                                                            ? 'bg-blue-50 text-blue-600 font-bold'
                                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                                    }`
                                                }
                                            >
                                                <span className="flex items-center space-x-2 truncate">
                                                    {sub.id === 'expiring-soon' && (
                                                        <ClockAlert className="w-3.5 h-3.5 shrink-0" />
                                                    )}
                                                    <span className="truncate">{sub.label}</span>
                                                </span>
                                                {Boolean(sub.badge) && (
                                                    <span
                                                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                                                            sub.id === 'low-stock'
                                                                ? 'bg-rose-100 text-rose-600'
                                                                : 'bg-amber-100 text-amber-600'
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
            <div className="pt-4 border-t border-slate-200 space-y-3 shrink-0">
                <div
                    className={`flex ${
                        isSidebarCollapsed ? 'justify-center px-0' : 'items-center space-x-3 px-2'
                    }`}
                >
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm border border-blue-200 shrink-0">
                        {user ? getInitials(user.nama_user) : 'U'}
                    </div>
                    {!isSidebarCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                                {user?.nama_user || 'User'}
                            </p>
                            <p className="text-xs text-slate-400 truncate capitalize">
                                {user?.role || 'Unknown'}
                            </p>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => authService.logout()}
                    className={`w-full flex ${
                        isSidebarCollapsed ? 'justify-center px-2' : 'items-center space-x-3 px-3'
                    } py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors`}
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {!isSidebarCollapsed && <span className="whitespace-nowrap">Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}