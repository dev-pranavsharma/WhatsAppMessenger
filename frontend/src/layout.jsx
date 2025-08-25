import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import LoadingSpinner from './components/loading-spinner';
import { tenantService, userService, WABussinessService } from './services/api';
import Login from './pages/login';
import { getCookie, setCookie } from './utils/Cookies';
import { setPhoneNumbers, setTenant, setUser } from './redux/slices/dataSlice';
import { SidebarProvider, SidebarTrigger } from '@components/ui/sidebar';
import AppSidebar from './components/sidebar';
import Navbar from '@components/navbar';

const Layout = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.data.user)
  const tenant = useSelector(state => state.data.tenant)
  const phone_numbers = useSelector(state => state.data.phoneNumbers)
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /**
   * Check if user is authenticated on app load
   */

  const checkAuthStatus = async () => {
    try {
      const userData = await userService.getCurrentUser();
      dispatch(setUser(userData))
    } catch (error) {
      
      // User not authenticated, stay on login page
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
      dispatch(setUser(userData.user))
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
    useEffect(() => {
    (async function () {
      const response = await tenantService.tenantById(user.tenant_id)
      console.log('tenantById', response);

      dispatch(setTenant(response.data))
    })()
  }, [user?.tenant_id]);

  useEffect(() => {
    if (tenant?.waba_id) {
      (async function () {
        const response = await WABussinessService.phoneNumbers(tenant.waba_id, tenant.access_token)
        console.log('phoneNumbers', response);
        dispatch(setPhoneNumbers(response.data))
      })()
    }
  }, [tenant?.waba_id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  if (!user.id) {
    return <Login onLogin={handleLogin} />;
  }
  return (
    <div className='bg-background text-foreground'>
      <SidebarProvider>
        <AppSidebar />
        <main className='w-full'>
          <Navbar />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </main>
      </SidebarProvider>
    </div>
  )
}

export default Layout