/**
 * Navigation Type Definitions
 */

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
  isExternal?: boolean;
  children?: NavItem[];
}

export interface MobileNavItem extends NavItem {
  showInBottomNav?: boolean;
  showInSidebar?: boolean;
}

export interface NavigationConfig {
  main: NavItem[];
  mobile: MobileNavItem[];
  footer: {
    sections: FooterSection[];
  };
}

export interface FooterSection {
  title: string;
  links: NavItem[];
}

/**
 * Bottom Navigation Configuration
 */
export interface BottomNavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
  requireAuth?: boolean;
}

/**
 * Sidebar Navigation Configuration
 */
export interface SidebarSection {
  title?: string;
  items: NavItem[];
}

export interface SidebarConfig {
  sections: SidebarSection[];
}

/**
 * Breadcrumb Types
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}
