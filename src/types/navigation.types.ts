import type { ElementType } from 'react';
import type { RoutePermission } from '../utils/role';

export interface SubNavItem {
    id: string;
    label: string;
    path?: string;
    badge?: number;
    icon?: ElementType;
}

export interface NavItem {
    id: string;
    label: string;
    icon: ElementType;
    path?: string;
    badge?: number;
    badgeColor?: string;
    children?: SubNavItem[];
    permission?: RoutePermission;
}