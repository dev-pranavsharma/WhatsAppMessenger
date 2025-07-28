import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { userService } from './services/api';
import Login from './pages/Login';
import { getCookie, setCookie } from './utils/Cookies';

const Layout = () => {
  const cookie_user = getCookie('user')
  const [user, setUser] = useState(cookie_user);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /**
   * Check if user is authenticated on app load
   */
  // useEffect(() => {
  //   checkAuthStatus();
  // }, []);
  // const checkAuthStatus = async () => {
  //   try {
  //     const userData = await userService.getCurrentUser();
  //     setUser(userData);
  //   } catch (error) {
  //     // User not authenticated, stay on login page
  //     setUser(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async (credentials) => {
    try {
      const userData = await userService.login(credentials);
      setUser(userData.user);
      setCookie('user', JSON.stringify(userData.user))
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  const handleRegister = async (credentials) => {
    try {
      const userData = await userService.register(credentials);
      setUser(userData.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  const handleLogout = async () => {
    try {
      await userService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout on client side even if server request fails
      setUser(null);
    }
  }
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  if (!user) {
    return <Login onRegister={handleRegister} onLogin={handleLogin} />;
  }
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        user={user}
      />

      {/* Main content area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'
        }`}>
        {/* Top header */}
        <Header
          user={user}
          onLogout={handleLogout}
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout