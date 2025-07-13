import { useEffect, useMemo, useState } from "react";
import { tenantService } from "../services/api";
import { AlertCircle, CheckCircle, Eye, EyeOff, Save } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import styles from './company.module.css'
import Stepper from "../components/Stepper";
import WhatsAppSignupPopup from "../components/WhatApp";
// import WhatsAppSignupPopup from "../components/WhatsAppES";

const CompanyForm = () => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);


    // Bussiness form state
    const [profileForm, setProfileForm] = useState({
        first_name: "",
        last_name: "",
        username: '',
        password: '',
        business_name: "",
        business_email: "",
        phone_number: "",
        phone_number_code: "",
        display_name: "",
        website_url: "",
        country: "",
        state: "",
        business_category: "",
        timezone: ""

    })
    const handleProfileChange = (e) => {
        const { name, value } = e.target;        
        setProfileForm(prev => ({
            ...prev,
            [name]: value
        }));
        // clearMessages();
    }
    useEffect(()=>{
        if (error) setError('');
        if (success) setSuccess('');
    },[profileForm])

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const Step1 = ({value, setvalue}) => {
        return (
            <div className="card">
                <div className="card-header">
                    <h2 className="font-semibold text-gray-900">Admin Details</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Fill admin details here
                    </p>
                </div>
                <div className="card-body">
                    <article className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="first_name" className="form-label"> first name </label>
                                <input type="text" placeholder="first name" id="first_name" name="first_name" value={value.first_name?value.first_name:""} onChange={(e) => setvalue(e)} className="form-input" required />
                            </div>
                            <div>
                                <label htmlFor="last_name" className="form-label"> last name </label>
                                <input type="text" placeholder="last name" id="last_name" name="last_name" value={value.last_name?value.last_name:""} onChange={(e) =>setvalue(e)} className="form-input" required />
                            </div>
                            <div>
                                <label htmlFor="username" className="form-label"> Username or Email </label>
                                <input id="username" name="username" type="text" required value={value.username} onChange={(e) =>setvalue(e)} className="form-input" placeholder="Enter your username or email" disabled={loading} />
                            </div> 
                            <div>
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <div className="relative">
                                    <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={value.password} onChange={(e) =>setvalue(e)} className="form-input pr-10" placeholder="Enter your password" disabled={loading} />
                                    <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" disabled={loading} >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                    <div className="card-footer">
                    <small className="text-center">All the following information is required to pre-fill and streamline the Facebook and WhatsApp Business onboarding process.</small>
                    </div>
                </div>
            </div>
        )
    }
    const Step2 = ({value, setvalue}) => {
        return (
            <div className="card">
                <div className="card-header">
                    <h2 className="font-semibold text-gray-900">Your Business Details</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Fill your business information
                    </p>
                </div>
                <div className="card-body">
                    <article className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="business_email" className="form-label"> Business Email </label>
                                <input type="email" placeholder="support@windandwool.com" id="business_email" name="business_email" value={value.business_email} onChange={(e) =>setvalue(e)} className="form-input" required />
                            </div>
                            <div>
                                <label htmlFor="business_name" className="form-label"> Business Name </label>
                                <input type="text" placeholder="Wind & Wool" id="business_name" name="business_name" value={value.business_name} onChange={(e) =>setvalue(e)} className="form-input" required/>
                            </div>
                            <div>
                                <label htmlFor="phone_number_code" className="form-label"> Phone Code </label>
                                <input placeholder='+91' type="tel" id="phone_number_code" name="phone_number_code" value={value.phone_number_code} onChange={(e) =>setvalue(e)} className="form-input" required/>
                            </div>
                            <div>
                                <label htmlFor="phone_number" className="form-label"> Phone Number </label>
                                <input type="tel" id="phone_number" name="phone_number" value={value.phone_number} onChange={(e) =>setvalue(e)} className="form-input" placeholder="1234567890" />
                            </div>
                        <div>
                            <label htmlFor="display_name" className="form-label"> Business Display Name </label>
                            <input type="text" placeholder="Wind & Wool" id="display_name" name="display_name" value={value.display_name} onChange={(e) =>setvalue(e)} className="form-input" />
                        </div>
                              <div className='select-wrapper'>
                                <label htmlFor="business_category" className="form-label">Business Category</label>
                                <select onChange={(e) =>setvalue(e)}  value={value.business_category} className="form-select" name="business_category" id="business_category">
                                    <option value={null}>Select category</option>
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
                               <div>
                            <label htmlFor="website_url" className="form-label"> Website URL </label>
                            <input type="text" placeholder="https://www.windandwool.com" id="website_url" name="website_url" value={value.website_url} onChange={(e) =>setvalue(e)} className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="business_description" className="form-label">Business Description </label>
                            <input type="text" placeholder="Bespoke artisan apparel and lifestyle goods from upcoming designers." id="business_description" name="business_description" value={value.business_description} onChange={(e) =>setvalue(e)} className="form-input" />
                        </div>
                        </div>
               
                 
  
                    </article>
                    <div className="card-footer">
                    <small className="text-center">All the following information is required to pre-fill and streamline the Facebook and WhatsApp Business onboarding process.</small>
                    </div>
                </div>
            </div>
        )
    }
    const Step3 = ({value, setvalue}) => {
        return (
            <div className="card">
                <div className="card-header">
                    <h2 className="font-semibold text-gray-900">Where You Operate Your Business</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Fill your business address and other location details
                    </p>
                </div>
                <div className="card-body">
                    <article className="space-y-6">
                            <div>
                                <label htmlFor="address_line_1" className="form-label">Address Line 1 </label>
                                <input type="text" placeholder="1 Hacker Way" id="address_line_1" name="address_line_1" value={value.addressline1} onChange={(e) =>setvalue(e)} className="form-input" />
                            </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                            <div>
                                <label htmlFor="address_line_2" className="form-label">Address Line 2 </label>
                                <input type="text" placeholder="Suite 1" id="address_line_2" name="address_line_2" value={value.addressline2} onChange={(e) =>setvalue(e)} className="form-input" />
                            </div>
                            <div className='select-wrapper'>
                                <label htmlFor="country" className="form-label">Country</label>
                                <select onChange={(e) =>setvalue(e)} value={value.country} className="form-select" name="country" id="country">
                                    <option selected value='select country'>Select country</option>
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
                                    <option value="IN">India</option>
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
                                <select onChange={(e) =>setvalue(e)} value={value.state} className="form-select" name="state" id="state">
                                    <option selected value={null}>Select state</option>
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
                                <label htmlFor="timezone" className="form-label">Timezone</label>
                                <select onChange={(e) =>setvalue(e)} value={value.timezone} className="form-select" name="timezone" id="timezone">
                                    <option value={null}>Select timezone</option>
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
                        <div className="flex justify-center">
                            <WhatsAppSignupPopup prefill={profileForm}/>
                            {/* <button onClick={() => handleProfileSubmit()} disabled={saving} className="btn btn-primary flex items-center gap-2 w-full" >
                                {saving ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                    </>
                                ) : (
                                    <>
                                        Save and Continue
                                    </>
                                )}
                            </button> */}
                        </div>
                    </article>
                    <div className="card-footer">
                    <small className="text-center">All the following information is required to pre-fill and streamline the Facebook and WhatsApp Business onboarding process.</small>
                    </div>
                </div>
            </div>
        )
    }

    const steps = useMemo(() => [Step1, Step2, Step3], []);

    console.log(profileForm);

    if (error) {
        return (
            <div className=" container flex items-center alert alert-error">
                <AlertCircle className="w-5 text-error h-5 mr-4" />
                {error}
            </div>
        )
    }
    if (success) {
        return (
            <div className="container alert alert-success">
                <CheckCircle className="w-4 h-4" />
                {success}
            </div>
        )
    }
    return (
        <section className="w-full pt-5">
            <h3 className="font-semibold  text-center text-gray-900">Create your Account with <span className="text-primary-700">Impretio</span></h3>
            <h6 className="font-medium text-gray-500 text-center">and make your marketing journey smooth.</h6>
            <section className="mt-5">
                <Stepper steps={steps}
                  value={profileForm}
                  setvalue={handleProfileChange}
                />
            </section>
        </section>
    )
}

export default CompanyForm