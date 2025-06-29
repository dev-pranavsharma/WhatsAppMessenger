import React, { useState, useEffect } from 'react';
import { Save, Key, User, Smartphone, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { userService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Settings page component for user profile and WhatsApp configuration
 * @param {Object} props - Component props
 * @param {Object} props.user - Current user data
 * @param {Function} props.onUserUpdate - Function to update user state
 */
const Settings = ({ user, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    business_name: '',
    phone_number: ''
  });

  // WhatsApp form state
  const [whatsappForm, setWhatsappForm] = useState({
    whatsapp_business_id: '',
    access_token: '',
    phone_number: ''
  });

  /**
   * Initialize form data with user information
   */
  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || '',
        email: user.email || '',
        business_name: user.business_name || '',
        phone_number: user.phone_number || ''
      });

      setWhatsappForm({
        whatsapp_business_id: user.whatsapp_business_id || '',
        access_token: user.access_token ? '••••••••••••' : '',
        phone_number: user.phone_number || ''
      });
    }
  }, [user]);

  /**
   * Handle profile form input changes
   * @param {Event} e - Input change event
   */
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
    clearMessages();
  };

  /**
   * Handle WhatsApp form input changes
   * @param {Event} e - Input change event
   */
  const handleWhatsAppChange = (e) => {
    const { name, value } = e.target;
    setWhatsappForm(prev => ({
      ...prev,
      [name]: value
    }));
    clearMessages();
  };

  /**
   * Clear error and success messages
   */
  const clearMessages = () => {
    if (error) setError('');
    if (success) setSuccess('');
  };

  /**
   * Handle profile form submission
   * @param {Event} e - Form submit event
   */
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const updatedUser = await userService.updateProfile(user.id, profileForm);
      onUserUpdate(updatedUser);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(`Failed to update profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle WhatsApp configuration submission
   * @param {Event} e - Form submit event
   */
  const handleWhatsAppSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const updatedUser = await userService.updateWhatsAppConfig(user.id, whatsappForm);
      onUserUpdate(updatedUser);
      setSuccess('WhatsApp configuration updated successfully');
    } catch (err) {
      setError(`Failed to update WhatsApp configuration: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };
  /**
   * Tab configuration
   */
  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'whatsapp', name: 'WhatsApp', icon: Smartphone },
    { id: 'api', name: 'API Keys', icon: Key }
  ];


  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and WhatsApp integration
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

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
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header">
                <h2 className="font-semibold text-gray-900">Profile Information</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Update your account profile and business information
                </p>
              </div>
              <div className="card-body">
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="username" className="form-label">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={profileForm.username}
                        onChange={handleProfileChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="business_name" className="form-label">
                        Business Name
                      </label>
                      <input
                        type="text"
                        id="business_name"
                        name="business_name"
                        value={profileForm.business_name}
                        onChange={handleProfileChange}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone_number" className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={profileForm.phone_number}
                        onChange={handleProfileChange}
                        className="form-input"
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn btn-primary flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <LoadingSpinner size="sm" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* WhatsApp settings */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-6">
              {/* Connection status */}
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        user?.is_verified ? 'bg-success-500' : 'bg-warning-500'
                      }`}></div>
                      <div>
                        <h3 className="font-medium text-gray-900">WhatsApp Business API</h3>
                        <p className="text-sm text-gray-600">
                          {user?.is_verified 
                            ? 'Connected and verified'
                            : 'Setup required to send messages'
                          }
                        </p>
                      </div>
                    </div>
                    {!user?.is_verified && (
                      <button className="btn btn-primary btn-sm">
                        Connect WhatsApp
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* WhatsApp configuration form */}
              <div className="card">
                <div className="card-header">
                  <h2 className="font-semibold text-gray-900">WhatsApp Configuration</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure your WhatsApp Business API credentials
                  </p>
                </div>
                <div className="card-body">
                  <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="whatsapp_business_id" className="form-label">
                        WhatsApp Business Account ID
                      </label>
                      <input
                        type="text"
                        id="whatsapp_business_id"
                        name="whatsapp_business_id"
                        value={whatsappForm.whatsapp_business_id}
                        onChange={handleWhatsAppChange}
                        className="form-input"
                        placeholder="Your WhatsApp Business Account ID"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Find this in your Facebook Business Manager under WhatsApp accounts
                      </p>
                    </div>

                    <div>
                      <label htmlFor="access_token" className="form-label">
                        Access Token
                      </label>
                      <input
                        type="password"
                        id="access_token"
                        name="access_token"
                        value={whatsappForm.access_token}
                        onChange={handleWhatsAppChange}
                        className="form-input"
                        placeholder="Enter your access token"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Your WhatsApp Business API access token
                      </p>
                    </div>

                    <div>
                      <label htmlFor="phone_number" className="form-label">
                        WhatsApp Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={whatsappForm.phone_number}
                        onChange={handleWhatsAppChange}
                        className="form-input"
                        placeholder="+1234567890"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        The phone number associated with your WhatsApp Business account
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={saving}
                        className="btn btn-primary flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <LoadingSpinner size="sm" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Configuration
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
                <a target='__blank' href='https://business.facebook.com/messaging/whatsapp/onboard/?app_id=1049671833273088&config_id=1810701329660457&extras=%7B%22sessionInfoVersion%22%3A%223%22%2C%22version%22%3A%22v3%22%7D'>WhatsApp SIgnup</a>
              {/* Setup guide */}
              <div className="card">
                <div className="card-header">
                  <h3 className="font-semibold text-gray-900">Setup Guide</h3>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary-600 text-sm font-medium">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Create Facebook Business Account</p>
                        <p className="text-sm text-gray-600">
                          Visit Facebook Business Manager and create a business account
                        </p>
                        <a
                          href="https://business.facebook.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 text-sm flex items-center gap-1 mt-1"
                        >
                          Go to Facebook Business <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary-600 text-sm font-medium">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Set up WhatsApp Business API</p>
                        <p className="text-sm text-gray-600">
                          Configure WhatsApp Business API in your Facebook Business account
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary-600 text-sm font-medium">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Get API Credentials</p>
                        <p className="text-sm text-gray-600">
                          Copy your Business Account ID and generate an access token
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-success-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Configure Above</p>
                        <p className="text-sm text-gray-600">
                          Enter your credentials in the form above and save
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Keys settings */}
          {activeTab === 'api' && (
            <div className="card">
              <div className="card-header">
                <h2 className="font-semibold text-gray-900">API Keys</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage API keys for external integrations
                </p>
              </div>
              <div className="card-body">
                <div className="text-center py-8">
                  <Key className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">API key management coming soon</p>
                  <p className="text-sm text-gray-400 mt-1">
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