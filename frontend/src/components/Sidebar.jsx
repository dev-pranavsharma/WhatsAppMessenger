import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BarChart3, MessageSquare, Users, FileText, Settings, LayoutDashboard, ChevronLeft, ChevronRight, Check, BadgeCheck, CheckCheck, User2, ChevronUp, Building2, ChevronDown, MoreHorizontal, MoreVertical, Sheet, DollarSign, DoorOpen, ChevronsUpDownIcon, Phone, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { getCookie } from '../utils/Cookies';
import { useSelector } from 'react-redux';
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

const AppSidebar = ({ isOpen, onToggle }) => {
  const user = useSelector(state => state.user.user)
  const tenant = useSelector(state => state.user.tenant)
  const phone_numbers = useSelector(state => state.user.phoneNumbers)
  const location = useLocation();
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

  console.log('user', user);
  console.log('tenant', tenant);

  const isActivePath = (path) => {
    return location.pathname === path;
  };
  console.log('phone_numbers', phone_numbers);

  const [openPhoneOptions, setOpenPhoneOptions] = useState(false)
  const [phone_number_id, setPhoneNumberId] = useState("")
  
  //  return (

  // <div className={`fixed left-0 top-0 min-h-screen border-r border-gray-700 transition-all duration-300 z-50 ${isOpen ? 'w-64' : 'w-16'
  //   }`}>
  //   {/* Sidebar header */}
  //   <div className="flex items-center justify-between p-4 border-b border-gray-200">
  //     {/* {isOpen && (
  //       <div className="flex items-center gap-3">
  //         <div className="w-8 h-8 -600 rounded-lg flex items-center justify-center">
  //           <MessageSquare className="w-5 h-5 text-white" />
  //         </div>
  //         <div>
  //           <h2 className="font-bold ">WhatsApp</h2>
  //           <p className="text-xs ">Campaign Manager</p>
  //         </div>
  //       </div>
  //     )} */}
  //     { isOpen &&
  //     <div>
  //     <h6>{tenant?.display_name}</h6>
  //     <p>{tenant?.business_name}</p>
  //     </div>
  //       }
  //     <button
  //       onClick={onToggle}
  //       className="p-1.5 rounded-lg hover: transition-colors"
  //       title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
  //     >
  //       {isOpen ? (
  //         <ChevronLeft className="w-5 h-5 " />
  //       ) : (
  //         <ChevronRight className="w-5 h-5 " />
  //       )}
  //     </button>
  //   </div>

  //   {/* User info section */}
  //   {isOpen && (
  //     <>
  //     <div className="p-4 border-b border-gray-200">
  //       <div className="flex items-center gap-3">
  //         <Avatar>
  //         <AvatarImage src={user?.img_url} alt="@shadcn" />
  //         <AvatarFallback>{user?.first_name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
  //         </Avatar>
  //         <div className="flex-1 min-w-0">
  //           <p className="font-medium  truncate"> {user?.first_name} {user?.last_name} </p>
  //           <p className="text-sm  truncate"> {user?.email} </p>
  //         </div>
  //       </div>
  //     </div>
  //     <div className='p-4'>
  //       <h5>Phone Numbers </h5>
  //       {
  //         phone_numbers&& Array.isArray(phone_numbers) && phone_numbers.map((data)=>(
  //           <div className='flex items-center justify-evenly gap-10 p-2 '>
  //           <div>
  //           <h6 className='flex items-center'>{data.verified_name}<span className='bg-success rounded-full ml-1'>{data.code_verification_status==='VERIFIED'?<CheckCheck size='22' className='text-white p-[2px]'/>:''}</span> </h6>
  //           <p>{data.display_phone_number}</p>
  //           </div>
  //           <div className=' rounded-full'>

  //           </div>
  //           </div>
  //         ))
  //       }
  //       </div>
  //       </>
  //   )}


  //   {/* Navigation menu */}
  //   <nav className="flex-1 p-2">
  //     <ul className="space-y-1">
  //       {navigationItems.map((item) => {
  //         const IconComponent = item.icon;
  //         const isActive = isActivePath(item.path);

  //         return (
  //           <li key={item.path}>
  //             <Link
  //               to={item.path}
  //               className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive
  //                   ? '-50 text-primary-700 border-r-2 border-primary-600'
  //                   : ' hover: hover:'
  //                 }`}
  //               title={!isOpen ? item.name : ''}
  //             >
  //               <IconComponent className={`w-5 h-5 ${isActive ? 'text-primary-600' : ' group-hover:'
  //                 }`} />

  //               {isOpen && (
  //                 <div className="flex-1">
  //                   <span className="font-medium">{item.name}</span>
  //                   <p className="text-xs  mt-0.5">
  //                     {item.description}
  //                   </p>
  //                 </div>
  //               )}
  //             </Link>
  //           </li>
  //         );
  //       })}
  //     </ul>
  //   </nav>

  //   {/* Footer section */}
  //   {isOpen && (
  //     <div className="p-4 border-t border-gray-200">
  //       <small className='block'><a href='./privacy_policy' target='__blank'>Privacy Policy</a> </small>
  //       <small className='block'><a href='./terms_and_conditions' target='__blank'>Terms & Conditions</a></small>
  //       <div className="text-xs mt-10 ">
  //         <p>WhatsApp Campaign Manager</p>
  //         <p>Version 1.0.0</p>
  //       </div>
  //     </div>
  //   )}
  // </div>
  //  );
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
            <p>{tenant?.display_name} phone numbers</p>
          </SidebarGroupLabel>
          {/* <SidebarGroupAction> */}
            <div className='cursor-pointer transition-all duration-300 hover:bg-secondary p-2 rounded-full'><PlusCircle/></div>
            {/* </SidebarGroupAction> */}
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
                  <DoorOpen/>
                  <span>Sign out</span>
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