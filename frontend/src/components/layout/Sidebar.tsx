import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import { cn } from '../../lib/utils';
import { LayoutDashboard, Users, Briefcase, ClipboardList, FileText, Settings, ChevronDown } from 'lucide-react';
import type { NavItem, SidebarNavProps } from '../../types/navigation';

// Define navigation items
const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'manager', 'employee']
  },
  {
    title: 'Employees',
    path: '/employees',
    icon: Users,
    roles: ['admin', 'manager'],
    children: [
      {
        title: 'All Employees',
        path: '/employees',
        icon: Users,
        roles: ['admin', 'manager']
      },
      {
        title: 'Add Employee',
        path: '/employees/new',
        icon: Users,
        roles: ['admin']
      }
    ]
  },
  {
    title: 'Departments',
    path: '/departments',
    icon: Briefcase,
    roles: ['admin'],
    children: [
      {
        title: 'All Departments',
        path: '/departments',
        icon: Briefcase,
        roles: ['admin']
      },
      {
        title: 'Add Department',
        path: '/departments/new',
        icon: Briefcase,
        roles: ['admin']
      }
    ]
  },
  {
    title: 'Projects',
    path: '/projects',
    icon: ClipboardList,
    roles: ['admin', 'manager', 'employee'],
    children: [
      {
        title: 'All Projects',
        path: '/projects',
        icon: ClipboardList,
        roles: ['admin', 'manager', 'employee']
      },
      {
        title: 'Create Project',
        path: '/projects/new',
        icon: ClipboardList,
        roles: ['admin', 'manager']
      }
    ]
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: FileText,
    roles: ['admin', 'manager']
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: Settings,
    roles: ['admin', 'manager', 'employee'],
    children: [
      {
        title: 'Profile',
        path: '/profile',
        icon: Settings,
        roles: ['admin', 'manager', 'employee']
      },
      {
        title: 'Account',
        path: '/account',
        icon: Settings,
        roles: ['admin', 'manager', 'employee']
      },
      {
        title: 'System Settings',
        path: '/admin/settings',
        icon: Settings,
        roles: ['admin']
      }
    ]
  }
];

const Sidebar: React.FC<SidebarNavProps> = ({ isOpen, onClose }) => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});

  // Toggle submenu
  const toggleItem = (path: string) => {
    setOpenItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.some(role => user?.roles?.includes(role));
  });

  // Check if a nav item is active
  const isActive = (path: string, exact: boolean = false) => {
    return exact 
      ? location.pathname === path 
      : location.pathname.startsWith(path);
  };

  // Check if any child is active
  const hasActiveChild = (children: NavItem[] = []) => {
    return children.some(child => isActive(child.path, true));
  };

  // Render navigation items
  const renderNavItems = (items: NavItem[], level: number = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isItemActive = isActive(item.path, !hasChildren);
      const isChildActive = hasChildren && hasActiveChild(item.children);
      const isOpen = openItems[item.path] || isChildActive;

      return (
        <div key={item.path} className="space-y-1">
          <NavLink
            to={hasChildren ? '#' : item.path}
            onClick={(e) => {
              if (hasChildren) {
                e.preventDefault();
                toggleItem(item.path);
              }
            }}
            className={cn(
              'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              isItemActive || isChildActive
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300',
              level > 0 ? `pl-${level * 4 + 4}` : ''
            )}
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            <span className="flex-1">{item.title}</span>
            {hasChildren && (
              <ChevronDown
                className={cn(
                  'h-4 w-4 transform transition-transform',
                  isOpen ? 'rotate-180' : ''
                )}
              />
            )}
          </NavLink>
          
          {hasChildren && (
            <div
              className={cn(
                'overflow-hidden transition-all duration-200',
                isOpen ? 'max-h-96' : 'max-h-0'
              )}
            >
              <div className="py-1 pl-4">
                {renderNavItems(item.children || [], level + 1)}
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
        'transform transition-transform duration-200 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0 md:static md:inset-0',
        'overflow-y-auto'
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            HR Analytics
          </h1>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          {renderNavItems(filteredNavItems)}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
