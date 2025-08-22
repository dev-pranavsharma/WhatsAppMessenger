import React, { useState } from 'react';
import { Bell, Search, LogOut, User, Menu } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';



const Header = ({ user, onLogout, onToggleSidebar, sidebarOpen }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Handle search input change
   * @param {Event} e - Input change event
   */
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  /**
   * Handle search form submission
   * @param {Event} e - Form submit event
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement global search functionality
    console.log('Search query:', searchQuery);
  };

  /**
   * Toggle user dropdown menu
   */
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  /**
   * Handle logout click
   */
  const handleLogoutClick = () => {
    setShowUserMenu(false);
    onLogout();
  };

  return (
    <header className="bg-background text-foreground px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu button and search */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile sidebar toggle */}
          <Button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg  transition-colors lg:hidden"
            title="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 " />
              <Input
                type="text"
                placeholder="Search campaigns, templates, contacts..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg "
              />
            </div>
          </form>
        </div>

        {/* Right side - Notifications and user menu */}
        <div className="flex items-center gap-3">
          {/* Notifications button */}
          <button
            className="relative p-2 rounded-lg hover: transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5 " />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={toggleUserMenu}
              className="flex items-center gap-3 p-2 rounded-lg hover: transition-colors"
              title="User menu"
            >
              <div className="w-8 h-8 -100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-medium text-sm">
                  {user?.first_name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="font-medium  text-sm">
                  {user?.first_name || user?.first_name || 'User'}{' '}{user?.last_name || user?.last_name || ''}
                </p>
                <small className="">
                  {user?.email}
                </small>
              </div>
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-gray-200">
                  <p className="font-medium ">
                    {user?.business_name || user?.username}
                  </p>
                  <p className="text-sm ">{user?.email}</p>
                  {user?.is_verified ? (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span className="text-xs text-success-600">WhatsApp Connected</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                      <span className="text-xs text-warning-600">Setup Required</span>
                    </div>
                  )}
                </div>

                <div className="p-1">
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left  hover: rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile Settings</span>
                  </button>

                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
      <ModeToggle/>
    </header>
  );
};

export default Header;