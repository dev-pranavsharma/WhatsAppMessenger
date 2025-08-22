import React, { useState, useEffect } from 'react';
import { Save, Key, User, Smartphone, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { tenantService, userService } from '../services/api';
import LoadingSpinner from '../components/loading-spinner';
import WhatsAppSignupPopup from '../components/whatsapp-signup';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useSelector } from 'react-redux';

const Settings = ({ user, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'whatsapp', name: 'WhatsApp', icon: Smartphone },
    { id: 'api', name: 'API Keys', icon: Key }
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold ">Settings</h1>
        <p className=" mt-1">
          Manage your account settings and WhatsApp integration
        </p>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${activeTab === tab.id
                    ? '-50 text-primary-700 border-r-2 border-primary-600'
                    : ' hover: hover:'
                    }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content area */}
        <div className="lg:col-span-3">
          {/* Profile settings */}

          {/* WhatsApp settings */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-6">
              {/* WhatsApp configuration form */}
              <div className="card">
                <div className="card-header text-center">
                  <div className='flex justify-center'>
                    <img className='' width={100} height={100} src='/assets/icons/whatsapp-icon.png' />
                  </div>
                  <div>
                    <h2 className="font-semibold ">WhatsApp Business</h2>
                    <p className="text-sm  mt-1">
                      Configure your WhatsApp Business account to use whatsapp
                    </p>
                  </div>
                  <WhatsAppSignupPopup prefill={profileForm} />
                </div>
              </div>
              {/* Setup guide */}
            </div>
          )}

          {/* API Keys settings */}
          {activeTab === 'api' && (
            <div className="card">
              <div className="card-header">
                <h2 className="font-semibold ">API Keys</h2>
                <p className="text-sm  mt-1">
                  Manage API keys for external integrations
                </p>
              </div>
              <div className="card-body">
                <div className="text-center py-8">
                  <Key className="w-12 h-12  mx-auto mb-3" />
                  <p className="">API key management coming soon</p>
                  <p className="text-sm  mt-1">
                    This feature will allow you to generate and manage API keys for third-party integrations
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;