import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BarChart3, MessageSquare, Users, FileText, Settings, LayoutDashboard, ChevronLeft, ChevronRight, Check, BadgeCheck, CheckCheck, User2, ChevronUp, Building2, ChevronDown, MoreHorizontal, MoreVertical, Sheet, DollarSign, DoorOpen, ChevronsUpDownIcon, Phone, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { getCookie } from '../utils/Cookies';
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar';
import { Sidebar, SidebarContent, SidebarHeader } from '@components/ui/sidebar';
import { SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarInput, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils';
import { userService } from '@/services/api';
import { useQueryClient } from '@tanstack/react-query';

const AppSidebar = ({ isOpen, onToggle }) => {
  const queryClient = useQueryClient()
  const location = useLocation();
  const session = queryClient.getQueryData(["session"]);
  const user = session?.user
  const tenant = session?.tenant
  const phone_numbers = queryClient.getQueryData(["phoneNumbers"]);
  /**
   * Navigation menu items with icons and paths
   */

  const campaigns = [
    {
      title: 'create campaign',
      path: 'campaign/new',
      description: 'create a campaign to publish'
    },
    {
      title: 'modify campaign',
      path: 'campaign/update',
      description: 'update an existing campaign'
    },
    {
      title: 'remove campaign',
      path: 'campaign/delete',
      description: 'make a campaign offline'
    },
  ]
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

  const isActivePath = (path) => {
    return location.pathname === path;
  };
  console.log('phone_numbers', phone_numbers);

  const [openPhoneOptions, setOpenPhoneOptions] = useState(false)
  const [phone_number_id, setPhoneNumberId] = useState("")

  const handleLogout = async () => {
    try {
      await userService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout on client side even if server request fails
    }
  }
  

  return (
    <Sidebar>
      <SidebarHeader>
        <div className='flex items-center gap-2 p-4'>
          <Avatar>
          <AvatarImage className='w-24' src={user?.img_url} alt="@shadcn" />
          <AvatarFallback className='text-xlg'>{user?.first_name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <div className='overflow-hidden'>
        <h6>{user?.first_name + ' ' +  user?.last_name}</h6>
        <small className='text-secondary-foreground truncate'>{user.email}</small>
        </div>
     </div>
      </SidebarHeader>
      <SidebarContent>
        
        <SidebarGroup>
            <div className="flex items-center justify-between">
          <SidebarGroupLabel>
            <h5 className='text-wrap'>Phone Numbers</h5>
          </SidebarGroupLabel>
          </div>
          <SidebarGroupContent>
            <Popover className='block' open={openPhoneOptions} onOpenChange={setOpenPhoneOptions}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openPhoneOptions}
                className="w-full flex justify-between py-7 text-left"
              >
                {phone_number_id
                  ?(
                    <div>
                  <p className='block'>{phone_numbers.find((phone) => phone.id === phone_number_id)?.verified_name}</p>
                  <small>{phone_numbers.find((phone) => phone.id === phone_number_id)?.display_phone_number}</small>
                  </div>
                  )
                  :( "Select Phone Number...")}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
              <PopoverContent className="w-full text-left">
                <Command>
                  <CommandInput placeholder="Search phone numbers..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No phone number found.</CommandEmpty>
                    <CommandGroup>
                      {Array.isArray(phone_numbers)&&phone_numbers?.map((data,i) => (
                        <CommandItem
                          key={i}
                          value={data.id}
                          onSelect={(currentValue) => {
                            queryClient.setQueryData(['active_phone_number'],data)
                            setPhoneNumberId(currentValue === phone_number_id ? "" : currentValue)
                            setOpenPhoneOptions(false)
                          }}
                        >
                  <div>
                    <p>{data.display_phone_number}</p>
                  <small>{data.verified_name}</small>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto",
                      phone_number_id === phone_numbers.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
            </Popover>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item,i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.path}>
                      <item.icon />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className='cursor-pointer' asChild>
                <Button variant='outline' className='w-full text-left py-6 flex items-center gap-4 px-3 justify-between'> 
                  <div className='flex items-center gap-4'>
                  <Building2/>
                  <div>
                  <h5 className=''>{tenant?.display_name}</h5>
                  <small>{tenant?.business_name}</small>              
                  </div>
                  </div>
                  <MoreVertical/>
                </Button>       
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                className="w-full"
              >
                <DropdownMenuItem>
                  <Link className='flex gap-3 items-center' to='/company/profile'><Sheet/>Profile</Link>       
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <DollarSign/>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className='flex items-center gap-2' onClick={()=>handleLogout()}>
                    <DoorOpen/>
                  <span>Sign out</span>
                  </div>
                  
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
};

export default AppSidebar;