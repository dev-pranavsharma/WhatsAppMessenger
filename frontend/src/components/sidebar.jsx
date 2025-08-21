import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, MessageSquare, Users, FileText, Settings, LayoutDashboard, ChevronLeft, ChevronRight, Check, BadgeCheck, CheckCheck } from 'lucide-react';
import { getCookie } from '../utils/Cookies';
import { useSelector } from 'react-redux';

const Sidebar = ({ isOpen, onToggle }) => {
  const user = useSelector(state=>state.user.user)
  const tenant = useSelector(state=>state.user.tenant)
  const phone_numbers = useSelector(state=>state.user.phoneNumbers)
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

  console.log('user',user);
    console.log('tenant',tenant);
  
  const isActivePath = (path) => {
    return location.pathname === path;
  };
  console.log('phone_numbers',phone_numbers);
  

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50 ${isOpen ? 'w-64' : 'w-16'
      }`}>
      {/* Sidebar header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {/* {isOpen && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 -600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold ">WhatsApp</h2>
              <p className="text-xs ">Campaign Manager</p>
            </div>
          </div>
        )} */}
        { isOpen &&
        <div>
        <h6>{tenant?.display_name}</h6>
        <p>{tenant?.business_name}</p>
        </div>
          }
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover: transition-colors"
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? (
            <ChevronLeft className="w-5 h-5 " />
          ) : (
            <ChevronRight className="w-5 h-5 " />
          )}
        </button>
      </div>

      {/* User info section */}
      {isOpen && (
        <>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 -100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-medium text-sm">
                {user?.first_name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium  truncate"> {user?.first_name} {user?.last_name} </p>
              <p className="text-sm  truncate"> {user?.email} </p>
            </div>
          </div>
        </div>
        <div className='p-4'>
          <h5>Phone Numbers </h5>
          {
            phone_numbers&& Array.isArray(phone_numbers) && phone_numbers.map((data)=>(
              <div className='flex items-center justify-evenly gap-10 p-2 '>
              <div>
              <h6 className='flex items-center'>{data.verified_name}<span className='bg-success rounded-full ml-1'>{data.code_verification_status==='VERIFIED'?<CheckCheck size='22' className='text-white p-[2px]'/>:''}</span> </h6>
              <p>{data.display_phone_number}</p>
              </div>
              <div className=' rounded-full'>
                
              </div>
              </div>
            ))
          }
          </div>
          </>
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive
                      ? '-50 text-primary-700 border-r-2 border-primary-600'
                      : ' hover: hover:'
                    }`}
                  title={!isOpen ? item.name : ''}
                >
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-primary-600' : ' group-hover:'
                    }`} />

                  {isOpen && (
                    <div className="flex-1">
                      <span className="font-medium">{item.name}</span>
                      <p className="text-xs  mt-0.5">
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
          <small className='block'><a href='./privacy_policy' target='__blank'>Privacy Policy</a> </small>
          <small className='block'><a href='./terms_and_conditions' target='__blank'>Terms & Conditions</a></small>
          <div className="text-xs mt-10 ">
            <p>WhatsApp Campaign Manager</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;