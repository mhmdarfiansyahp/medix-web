import type { ElementType } from 'react';

export interface SubNavItem {
    id: string;
    label: string;
    path?: string;        //  Tambahkan ini
    badge?: number;
    icon?: ElementType;   //  Opsional jika sub-menu pakai icon (seperti ClockAlert)
}

export interface NavItem {
    id: string;
    label: string;
    icon: ElementType;
    path?: string;        //  Tambahkan ini
    badge?: number;
    badgeColor?: string;
    children?: SubNavItem[];
}