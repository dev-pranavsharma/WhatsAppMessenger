import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import LoadingSpinner from './components/loading-spinner';
import { tenantService, userService, WABussinessService } from './services/api';
import Login from './pages/login';
import { SidebarProvider, SidebarTrigger } from '@components/ui/sidebar';
import AppSidebar from './components/sidebar';
import Navbar from '@components/navbar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const Layout = () => {
  const queryClient = useQueryClient()
  const [sidebarOpen, setSidebarOpen] = useState(true);
  /**
   * Check if user is authenticated on app load
   */

    const { data:user, isLoading:isUserLoading, isError } = useQuery({
    queryKey: ["session"],
    queryFn: userService.getCurrentUser, // calls /me
    retry: false,
  });


  const loginMutation = useMutation({
  mutationFn: userService.login,
  onSuccess: (response) => {
    queryClient.setQueryData(["user"], response.data.user);
    queryClient.setQueryData(["tenant"], response.data.tenant);
  },
  onError: (error) => {
    console.error("Login failed:", error.message);
   },
  })
  const handleLogin = (credentials) => {
    loginMutation.mutate(credentials)
  }

  const tenant = queryClient.getQueryData(["tenant"]);
  // const user = queryClient.getQueryData("user");

  const { data: phoneNumbers,isLoading:isPhoneNumberLoading, error } = useQuery({
    queryKey: ["phoneNumbers"], // unique per tenant
    queryFn: () =>
      WABussinessService.phoneNumbers(
        tenant.waba_id,
        tenant.access_token
      ),
    enabled: tenant?.waba_id, // ✅ only run if tenant exists
  });

  console.log(user);
  
  if (isUserLoading || isPhoneNumberLoading ) {
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