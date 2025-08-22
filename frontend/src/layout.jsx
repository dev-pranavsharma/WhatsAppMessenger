import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import LoadingSpinner from './components/loading-spinner';
import { userService } from './services/api';
import Login from './pages/login';
import { getCookie, setCookie } from './utils/Cookies';
import { setUser } from './redux/slices/userSlice';
import { SidebarProvider , SidebarTrigger } from '@components/ui/sidebar';
import AppSidebar from './components/sidebar';
import Navbar from '@components/navbar';

const Layout = () => {
  const dispatch=useDispatch()
  const user = useSelector(state=>state.user.user)
  const cookie_user = getCookie('user')
  // const [user, setUser] = useState(cookie_user);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /**
   * Check if user is authenticated on app load
   */

  const checkAuthStatus = async () => {
    try {
      const userData = await userService.getCurrentUser();
      dispatch(setUser(userData))
      setUser(userData);
    } catch (error) {
      // User not authenticated, stay on login page
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const userData = await userService.login(credentials);
      console.log(userData);
       dispatch(setUser(userData.user))
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  const handleRegister = async (credentials) => {
    try {
      const userData = await userService.register(credentials);
      dispatch(setUser(userData.user));
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
  if (!user.id) {
    return <Login onRegister={handleRegister} onLogin={handleLogin} />;
  }
  return (
    <div className='bg-background text-foreground'>
      <SidebarProvider>
      <AppSidebar />
      <main className='w-full'>
        <Navbar
          user={user}
          onLogout={handleLogout}
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
    </main>
    </SidebarProvider>
    </div>
  )
}

export default Layout