import React, { useState } from 'react';
import { Bell, Search, LogOut, User, Menu } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@components/ui/sidebar';



const Navbar = ({ user, onToggleSidebar, sidebarOpen }) => {
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

  return (
    <nav className="flex items-center justify-between px-6 py-4 gap">
        <SidebarTrigger />
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

        <div className="">
        <ModeToggle />
        </div>
    </nav>
  );
};

export default Navbar;