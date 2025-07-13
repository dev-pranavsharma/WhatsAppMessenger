import React, { useState, useEffect } from 'react';
import { Save, Key, User, Smartphone, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { tenantService, userService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import WhatsAppSignupPopup from '../components/WhatsAppES';

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
    country:"",
    state:"",
    business_category:"",
    timezone:""

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
  console.log(profileForm)

  useEffect(() => {
    const getTenantDetails = async () => {
      try {
        setLoading(true)
        const res = await tenantService.tenantById();
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className='select-wrapper'>
                          <label htmlFor="country" className="form-label">Country</label>
                          <select value={profileForm.country} className="form-select" name="country" id="country">
                            <option value="AF">Afghanistan</option>
                            <option value="AL">Albania</option>
                            <option value="DZ">Algeria</option>
                            <option value="AR">Argentina</option>
                            <option value="AU">Australia</option>
                            <option value="BR">Brazil</option>
                            <option value="CA">Canada</option>
                            <option value="CN">China</option>
                            <option value="EG">Egypt</option>
                            <option value="FR">France</option>
                            <option value="DE">Germany</option>
                            <option value="IN" selected>India</option>
                            <option value="ID">Indonesia</option>
                            <option value="IT">Italy</option>
                            <option value="JP">Japan</option>
                            <option value="MX">Mexico</option>
                            <option value="NG">Nigeria</option>
                            <option value="PK">Pakistan</option>
                            <option value="RU">Russia</option>
                            <option value="ZA">South Africa</option>
                            <option value="ES">Spain</option>
                            <option value="GB">United Kingdom</option>
                            <option value="US">United States</option>
                          </select>
                        </div>
                        <div className='select-wrapper'>
                          <label htmlFor="state" className="form-label">State</label>
                          <select value={profileForm.state} className="form-select" name="state" id="state">
                            <option value="AN">Andaman and Nicobar Islands</option>
                            <option value="AP">Andhra Pradesh</option>
                            <option value="AR">Arunachal Pradesh</option>
                            <option value="AS">Assam</option>
                            <option value="BR">Bihar</option>
                            <option value="CH">Chandigarh</option>
                            <option value="CT">Chhattisgarh</option>
                            <option value="DN">Dadra and Nagar Haveli and Daman and Diu</option>
                            <option value="DL">Delhi</option>
                            <option value="GA">Goa</option>
                            <option value="GJ">Gujarat</option>
                            <option value="HR">Haryana</option>
                            <option value="HP">Himachal Pradesh</option>
                            <option value="JK">Jammu and Kashmir</option>
                            <option value="JH">Jharkhand</option>
                            <option value="KA">Karnataka</option>
                            <option value="KL">Kerala</option>
                            <option value="LD">Lakshadweep</option>
                            <option value="MP">Madhya Pradesh</option>
                            <option value="MH">Maharashtra</option>
                            <option value="MN">Manipur</option>
                            <option value="ML">Meghalaya</option>
                            <option value="MZ">Mizoram</option>
                            <option value="NL">Nagaland</option>
                            <option value="OR">Odisha</option>
                            <option value="PY">Puducherry</option>
                            <option value="PB">Punjab</option>
                            <option value="RJ">Rajasthan</option>
                            <option value="SK">Sikkim</option>
                            <option value="TN">Tamil Nadu</option>
                            <option value="TG">Telangana</option>
                            <option value="TR">Tripura</option>
                            <option value="UP" selected>Uttar Pradesh</option>
                            <option value="UT">Uttarakhand</option>
                            <option value="WB">West Bengal</option>
                          </select>
                        </div>
                        <div className='select-wrapper'>
                          <label htmlFor="business_category" className="form-label">Business Category</label>
                          <select value={profileForm.business_category} className="form-select" name="business_category" id="business_category">
                            <option value="AUTOMOTIVE">Automotive</option>
                            <option value="BEAUTY">Beauty, Spa & Salon</option>
                            <option value="CLOTHING">Clothing & Apparel</option>
                            <option value="EDUCATION">Education</option>
                            <option value="ENTERTAINMENT">Entertainment</option>
                            <option value="EVENT_PLANNING">Event Planning & Service</option>
                            <option value="FINANCE">Finance & Banking</option>
                            <option value="FOOD_BEVERAGE" selected>Food & Beverage</option>
                            <option value="GROCERY">Grocery</option>
                            <option value="HEALTH">Health & Wellness</option>
                            <option value="HOME_IMPROVEMENT">Home Improvement</option>
                            <option value="HOTEL">Hotel & Lodging</option>
                            <option value="NON_PROFIT">Non-profit</option>
                            <option value="PROFESSIONAL_SERVICES">Professional Services</option>
                            <option value="RETAIL">Retail</option>
                            <option value="TRAVEL">Travel & Transportation</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                        <div className='select-wrapper'>
                          <label htmlFor="timezone" className="form-label">Timezone</label>
                          <select value={profileForm.timezone} className="form-select" name="timezone" id="timezone">
                            <option value="Africa/Abidjan">Africa/Abidjan (UTC+00:00)</option>
                            <option value="Africa/Nairobi">Africa/Nairobi (UTC+03:00)</option>
                            <option value="America/Los_Angeles">America/Los_Angeles (UTC-08:00)</option>
                            <option value="America/New_York">America/New_York (UTC-05:00)</option>
                            <option value="Asia/Dubai">Asia/Dubai (UTC+04:00)</option>
                            <option value="Asia/Kolkata" selected>Asia/Kolkata (UTC+05:30)</option>
                            <option value="Asia/Tokyo">Asia/Tokyo (UTC+09:00)</option>
                            <option value="Australia/Sydney">Australia/Sydney (UTC+10:00)</option>
                            <option value="Europe/London">Europe/London (UTC+00:00)</option>
                            <option value="Europe/Paris">Europe/Paris (UTC+01:00)</option>
                            <option value="Pacific/Auckland">Pacific/Auckland (UTC+12:00)</option>
                          </select>
                        </div>
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