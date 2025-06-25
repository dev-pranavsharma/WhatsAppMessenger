import { Link } from "wouter";
import { 
  Rocket, 
  Megaphone, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  PlaneTakeoff,
  User,
  LogOut
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
}

const Sidebar = ({ activeTab }: SidebarProps) => {
  const navigationItems = [
    { id: "onboarding", label: "Getting Started", icon: Rocket, href: "/dashboard/onboarding" },
    { id: "campaigns", label: "Campaigns", icon: Megaphone, href: "/dashboard/campaigns" },
    { id: "templates", label: "Templates", icon: FileText, href: "/dashboard/templates" },
    { id: "contacts", label: "Contacts", icon: Users, href: "/dashboard/contacts" },
    { id: "analytics", label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <PlaneTakeoff className="text-white text-lg" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">MessagePro</h1>
            <p className="text-sm text-gray-500">WhatsApp Integration</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="text-gray-600" size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500">john@company.com</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
