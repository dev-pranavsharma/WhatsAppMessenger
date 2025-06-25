import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
  activeTab: string;
}

const Header = ({ title, subtitle, activeTab }: HeaderProps) => {
  const handleTestConnection = () => {
    // TODO: Implement WhatsApp connection test
    console.log("Testing WhatsApp connection...");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">{subtitle}</p>
        </div>
        {activeTab !== "onboarding" && (
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleTestConnection}
              className="bg-whatsapp hover:bg-whatsapp-dark text-white flex items-center space-x-2"
            >
              <MessageSquare size={16} />
              <span>Test Connection</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
