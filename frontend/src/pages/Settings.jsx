import React, { useState, useEffect } from 'react';
import { Save, Key, User, Smartphone, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { tenantService, userService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import WhatsAppSignupPopup from '../components/WhatsAppES';

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

  // Bussiness form state
  const [profileForm, setProfileForm] = useState({
    id: "",
    business_name: "",
    business_email: "",
    phone_number: "",
    phone_number_code: "",
    first_name: "",
    last_name: "",
    display_name: "",
    website_url: "",
  })


  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
    clearMessages();
  };

  const clearMessages = () => {
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleProfileSubmit = async () => {
    setSaving(true);
    setError('');

    try {
      const updatedUser = await tenantService.updateTenant(profileForm);
      onUserUpdate(updatedUser);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(`Failed to update profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };


  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'whatsapp', name: 'WhatsApp', icon: Smartphone },
    { id: 'api', name: 'API Keys', icon: Key }
  ];
  console.log(profileForm);

  useEffect(() => {
    const getTenantDetails = async () => {
      try {
        setLoading(true)
        const res = await tenantService.tenantById();
        console.log(res);

        setProfileForm(res.data);
      } catch (err) {
        setLoading(false)
        setError(`Failed to update profile: ${err.message}`);
      } finally {
        setLoading(false)
        setSaving(false);
      }
    };
    getTenantDetails()
  }, [])
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
        <div className="flex items-center alert alert-error">
          <AlertCircle className="w-5 text-error h-5 mr-4" />
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
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${activeTab === tab.id
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
                <h2 className="font-semibold text-gray-900">Business Information</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Update your account profile and business information
                </p>
              </div>
              <div className="card-body">
                {
                  loading ? <LoadingSpinner /> :
                    <article className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="username" className="form-label"> first name </label>
                          <input type="text" id="first_name" name="first_name" value={profileForm.first_name} onChange={(e) => handleProfileChange(e)} className="form-input" required />
                        </div>
                        <div>
                          <label htmlFor="last_name" className="form-label"> last name </label>
                          <input type="text" id="last_name" name="last_name" value={profileForm.last_name} onChange={(e) => handleProfileChange(e)} className="form-input" required />
                        </div>
                        <div>
                          <label htmlFor="business_email" className="form-label"> Business Email </label>
                          <input type="email" id="business_email" name="business_email" value={profileForm.business_email} onChange={(e) => handleProfileChange(e)} className="form-input" required />
                        </div>

                        <div>
                          <label htmlFor="business_name" className="form-label"> Business Name </label>
                          <input type="text" id="business_name" name="business_name" value={profileForm.business_name} onChange={(e) => handleProfileChange(e)} className="form-input" />
                        </div>
                        <div>
                          <label htmlFor="phone_number_code" className="form-label"> Phone Code </label>
                          <input type="tel" id="phone_number_code" name="phone_number_code" value={profileForm.phone_number_code} onChange={(e) => handleProfileChange(e)} className="form-input" placeholder="+91" />
                        </div>
                        <div>
                          <label htmlFor="phone_number" className="form-label"> Phone Number </label>
                          <input type="tel" id="phone_number" name="phone_number" value={profileForm.phone_number} onChange={(e) => handleProfileChange(e)} className="form-input" placeholder="1234567890" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="display_name" className="form-label"> Business Display Name </label>
                        <input type="text" id="display_name" name="display_name" value={profileForm.display_name} onChange={(e) => handleProfileChange(e)} className="form-input" />
                      </div>
                      <div>
                        <label htmlFor="website_url" className="form-label"> Website URL </label>
                        <input type="text" id="website_url" name="website_url" value={profileForm.website_url} onChange={(e) => handleProfileChange(e)} className="form-input" />
                      </div>
                      <div className="flex justify-end">
                        <button onClick={() => handleProfileSubmit()} disabled={saving} className="btn border bg-primary-500 text-white hover:bg-primary-800 flex items-center gap-2" >
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
                    </article>

                }
              </div>
            </div>
          )}

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
                    <h2 className="font-semibold text-gray-900">WhatsApp Business</h2>
                    <p className="text-sm text-gray-600 mt-1">
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