import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  ClockAlert
} from 'lucide-react';

import type { NavItem } from '../../types/navigation.types';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isStockOpen, setIsStockOpen] = useState<boolean>(true);


  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      id: 'drug-management',
      label: 'Drug Management',
      icon: Pill,
      path: '/drug-management',
    },
    {
      id: 'drug-categories',
      label: 'Drug Categories',
      icon: Tags,
      path: '/drug-categories',
    },
    {
      id: 'stock-alerts',
      label: 'Notifications & Stock',
      icon: AlertTriangle,
      badge: 5,
      badgeColor: 'bg-amber-100 text-amber-700',
      children: [
        {
          id: 'low-stock',
          label: 'Low Stock',
          badge: 3,
          path: '/stock-alerts/low-stock'
        },
        {
          id: 'expiring-soon',
          label: 'Expiring Soon',
          badge: 2,
          path: '/stock-alerts/expiring-soon',
          icon: ClockAlert
        },
      ],
    },
    {
      id: 'reports',
      label: 'Reports & Export',
      icon: FileSpreadsheet,
      path: '/reports',
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: Users,
      path: '/users',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
    },
  ];

  return (
    <aside className="hidden md:flex w-64 h-full bg-white border-r border-slate-200 flex-col shrink-0 justify-between p-4">
      <div>
        <div className="px-3 py-2 mb-4">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
            Medix
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Pharmacy Management
          </p>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            // Mengecek apakah menu aktif berdasarkan path URL saat ini
            const isActive = item.path ? location.pathname === item.path : false;

            return (
              <div key={item.id} className="w-full">
                {/* Main Menu Item */}
                {hasChildren ? (
                  <button
                    onClick={() => setIsStockOpen(!isStockOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all duration-150"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-slate-500" />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
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
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              Administrator
            </p>
            <p className="text-xs text-slate-400 truncate">admin@potekgas.com</p>
          </div>
        </div>

        <button className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}