import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import LoadingSpinner from './components/loading-spinner';
import { libraryService, tenantService, userService, WABussinessService } from './services/api';
import Login from './pages/login';
import { SidebarProvider, SidebarTrigger } from '@components/ui/sidebar';
import AppSidebar from './components/sidebar';
import Navbar from '@components/navbar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const Layout = () => {
  const queryClient = useQueryClient()
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: user, isLoading: isUserLoading, isError } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const response = await userService.getCurrentUser()
      return response.data
    }, // calls /me
    retry: false,
    staleTime: Infinity,
  });


  const loginMutation = useMutation({
    mutationFn: userService.login,
    onSuccess: (response) => {
      window.location.reload()
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
    },
  })

  const handleLogin = (credentials) => {
    loginMutation.mutate(credentials)
  }

  const session = queryClient.getQueryData(["session"]);
  // const user = queryClient.getQueryData("user");

  const { data: phoneNumbers, isLoading: isPhoneNumberLoading, error } = useQuery({
    queryKey: ["phoneNumbers"], // unique per tenant
    queryFn: () =>
      WABussinessService.phoneNumbers(
        session?.tenant.waba_id,
        session?.tenant.access_token
      ),
    staleTime: Infinity,
    enabled: !!session?.tenant?.waba_id, // ✅ only run if tenant exists
  });

  useQuery({
    queryKey: ['countryCodes'],
    queryFn:async () => {
      const response = await libraryService.countryCodes()
      return response.data
    },
    staleTime: Infinity,
  })
   useQuery({
    queryKey: ['genders'],
    queryFn:async (params) => {
      const response = await libraryService.genders()
      return response.data
    },
    staleTime: Infinity,
  })
  console.log(session);

  if (!session?.user?.id) {
    return <Login onLogin={handleLogin} loading={loginMutation.isPending} />;
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