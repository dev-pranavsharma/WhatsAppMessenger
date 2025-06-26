import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  FileText, 
  Settings, 
  LayoutDashboard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

/**
 * Sidebar navigation component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Sidebar open/closed state
 * @param {Function} props.onToggle - Toggle sidebar function
 * @param {Object} props.user - Current user data
 */
const Sidebar = ({ isOpen, onToggle, user }) => {
  const location = useLocation();

  /**
   * Navigation menu items with icons and paths
   */
  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      description: 'Overview and quick actions'
    },
    {
      name: 'Campaigns',
      path: '/campaigns',
      icon: MessageSquare,
      description: 'Manage marketing campaigns'
    },
    {
      name: 'Templates',
      path: '/templates',
      icon: FileText,
      description: 'Message templates'
    },
    {
      name: 'Contacts',
      path: '/contacts',
      icon: Users,
      description: 'Contact management'
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
      description: 'Performance metrics'
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      description: 'Account settings'
    }
  ];

  /**
   * Check if current path is active
   * @param {string} path - Menu item path
   * @returns {boolean} Is path active
   */
  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Sidebar header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isOpen && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">WhatsApp</h2>
              <p className="text-xs text-gray-500">Campaign Manager</p>
            </div>
          </div>
        )}
        
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* User info section */}
      {isOpen && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-medium text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {user?.business_name || user?.username || 'User'}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {user?.email}
              </p>
              {user?.is_verified && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <span className="text-xs text-success-600">WhatsApp Connected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation menu */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={!isOpen ? item.name : ''}
                >
                  <IconComponent className={`w-5 h-5 ${
                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  
                  {isOpen && (
                    <div className="flex-1">
                      <span className="font-medium">{item.name}</span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer section */}
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>WhatsApp Campaign Manager</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;