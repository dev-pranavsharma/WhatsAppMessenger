import { useEffect, useMemo, useState } from "react";
import { tenantService, userService } from "../services/api";
import { AlertCircle, CheckCircle, Eye, EyeOff, Save } from "lucide-react";
import LoadingSpinner from "../components/loading-spinner";
import Stepper from "../components/stepper";
import WhatsAppSignupPopup from "../components/whatsapp";
import { getCookie } from "../utils/Cookies";
import { Input } from "@/components/ui/Input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CompanyForm = () => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // Bussiness form state
    const [profileForm, setProfileForm] = useState({
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
    }
    useEffect(() => {
        if (error) setError('');
        if (success) setSuccess('');
    }, [profileForm])

    const Step1 = ({ value, setvalue }) => {
        return (
            <Card>
                    <CardHeader>
                    <CardTitle>Your Business Details</CardTitle>
                    <CardDescription> Fill your business information </CardDescription>
                    <CardAction>Already have an account ? <Link to='/login' className="underline" >login</Link></CardAction>
                    </CardHeader>
                <CardContent >
                    <article className='grid grid-cols-2 gap-5'>
                            <div>
                                <Label htmlFor="business_email"> Business Email </Label>
                                <Input type="email" placeholder="support@windandwool.com" id="business_email" name="business_email" value={value.business_email} onChange={(e) => setvalue(e)} className="form-Input" required />
                            </div>
                            <div>
                                <Label htmlFor="business_name" > Business Name </Label>
                                <Input type="text" placeholder="Wind & Wool" id="business_name" name="business_name" value={value.business_name} onChange={(e) => setvalue(e)} className="form-Input" required />
                            </div>
                            <div>
                                <Label htmlFor="phone_number_code" > Phone Code </Label>
                                <Input placeholder='+91' type="tel" id="phone_number_code" name="phone_number_code" value={value.phone_number_code} onChange={(e) => setvalue(e)} className="form-Input" required />
                            </div>
                            <div>
                                <Label htmlFor="phone_number" > Phone Number </Label>
                                <Input type="tel" id="phone_number" name="phone_number" value={value.phone_number} onChange={(e) => setvalue(e)} className="form-Input" placeholder="1234567890" />
                            </div>
                            <div>
                                <Label htmlFor="display_name" > Business Display Name </Label>
                                <Input type="text" placeholder="Wind & Wool" id="display_name" name="display_name" value={value.display_name} onChange={(e) => setvalue(e)} className="form-Input" />
                            </div>
                            <div>
                                <Label htmlFor="business_category" >Business Category</Label>
                                <Select
                                    onValueChange={(value) => setvalue({ target: { name: "business_category", value } })}
                                    value={value.business_category}
                                    name="business_category"
                                    id="business_category"
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="null">Select category</SelectItem>
                                        <SelectItem value="AUTOMOTIVE">Automotive</SelectItem>
                                        <SelectItem value="BEAUTY">Beauty, Spa & Salon</SelectItem>
                                        <SelectItem value="CLOTHING">Clothing & Apparel</SelectItem>
                                        <SelectItem value="EDUCATION">Education</SelectItem>
                                        <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
                                        <SelectItem value="EVENT_PLANNING">Event Planning & Service</SelectItem>
                                        <SelectItem value="FINANCE">Finance & Banking</SelectItem>
                                        <SelectItem value="FOOD_BEVERAGE">Food & Beverage</SelectItem>
                                        <SelectItem value="GROCERY">Grocery</SelectItem>
                                        <SelectItem value="HEALTH">Health & Wellness</SelectItem>
                                        <SelectItem value="HOME_IMPROVEMENT">Home Improvement</SelectItem>
                                        <SelectItem value="HOTEL">Hotel & Lodging</SelectItem>
                                        <SelectItem value="NON_PROFIT">Non-profit</SelectItem>
                                        <SelectItem value="PROFESSIONAL_SERVICES">Professional Services</SelectItem>
                                        <SelectItem value="RETAIL">Retail</SelectItem>
                                        <SelectItem value="TRAVEL">Travel & Transportation</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="website_url" > Website URL </Label>
                                <Input type="text" placeholder="https://www.windandwool.com" id="website_url" name="website_url" value={value.website_url} onChange={(e) => setvalue(e)} className="form-Input" />
                            </div>
                            <div>
                                <Label htmlFor="business_description" >Business Description </Label>
                                <Input type="text" placeholder="Bespoke artisan apparel and lifestyle goods from upcoming designers." id="business_description" name="business_description" value={value.business_description} onChange={(e) => setvalue(e)} className="form-Input" />
                            </div>
                            </article>
                    <CardFooter className={'mt-10'}>
                        <small>All the following information is required to pre-fill and streamline the Facebook and WhatsApp Business onboarding process.</small>
                    </CardFooter>
                </CardContent>
            </Card>
         
        )
    }
    const Step2 = ({ value, setvalue }) => {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Where You Operate Your Business</CardTitle>
                    <CardDescription>Fill your business address and other location details</CardDescription>
                </CardHeader>
                <CardContent>
                        <article className="space-y-6">
                        <div>
                            <Label htmlFor="address_line_1" >Address Line 1 </Label>
                            <Input type="text" placeholder="1 Hacker Way" id="address_line_1" name="address_line_1" value={value.addressline1} onChange={(e) => setvalue(e)} className="form-Input" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <Label htmlFor="address_line_2" >Address Line 2 </Label>
                                <Input type="text" placeholder="Suite 1" id="address_line_2" name="address_line_2" value={value.addressline2} onChange={(e) => setvalue(e)} className="form-Input" />
                            </div>
                            <div className="w-full" >
                                <Label htmlFor="country" >Country</Label>
                                <Select
                                    onValueChange={(value) => setvalue({ target: { name: "country", value } })}
                                    value={value.country}
                                    name="country"
                                    id="country"
                                >
                                    <SelectTrigger className='w-full' >
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="select country">Select country</SelectItem>
                                        <SelectItem value="IN">India</SelectItem>
                                        <SelectItem value="AF">Afghanistan</SelectItem>
                                        <SelectItem value="AL">Albania</SelectItem>
                                        <SelectItem value="DZ">Algeria</SelectItem>
                                        <SelectItem value="AR">Argentina</SelectItem>
                                        <SelectItem value="AU">Australia</SelectItem>
                                        <SelectItem value="BR">Brazil</SelectItem>
                                        <SelectItem value="CA">Canada</SelectItem>
                                        <SelectItem value="CN">China</SelectItem>
                                        <SelectItem value="EG">Egypt</SelectItem>
                                        <SelectItem value="FR">France</SelectItem>
                                        <SelectItem value="DE">Germany</SelectItem>
                                        <SelectItem value="ID">Indonesia</SelectItem>
                                        <SelectItem value="IT">Italy</SelectItem>
                                        <SelectItem value="JP">Japan</SelectItem>
                                        <SelectItem value="MX">Mexico</SelectItem>
                                        <SelectItem value="NG">Nigeria</SelectItem>
                                        <SelectItem value="PK">Pakistan</SelectItem>
                                        <SelectItem value="RU">Russia</SelectItem>
                                        <SelectItem value="ZA">South Africa</SelectItem>
                                        <SelectItem value="ES">Spain</SelectItem>
                                        <SelectItem value="GB">United Kingdom</SelectItem>
                                        <SelectItem value="US">United States</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div >
                                <Label htmlFor="state" >State</Label>
                                <Select
                                    onValueChange={(value) => setvalue({ target: { name: "state", value } })}
                                    value={value.state}
                                    name="state"
                                    id="state"
                                >
                                    <SelectTrigger className={'w-full'} >
                                        <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="null">Select state</SelectItem>
                                        <SelectItem value="DL">Delhi</SelectItem>
                                        <SelectItem value="UP">Uttar Pradesh</SelectItem>
                                        <SelectItem value="MH">Maharashtra</SelectItem>
                                        <SelectItem value="HR">Haryana</SelectItem>
                                        <SelectItem value="AN">Andaman and Nicobar Islands</SelectItem>
                                        <SelectItem value="AP">Andhra Pradesh</SelectItem>
                                        <SelectItem value="AR">Arunachal Pradesh</SelectItem>
                                        <SelectItem value="AS">Assam</SelectItem>
                                        <SelectItem value="BR">Bihar</SelectItem>
                                        <SelectItem value="CH">Chandigarh</SelectItem>
                                        <SelectItem value="CT">Chhattisgarh</SelectItem>
                                        <SelectItem value="DN">Dadra and Nagar Haveli and Daman and Diu</SelectItem>
                                        <SelectItem value="GA">Goa</SelectItem>
                                        <SelectItem value="GJ">Gujarat</SelectItem>
                                        <SelectItem value="HP">Himachal Pradesh</SelectItem>
                                        <SelectItem value="JK">Jammu and Kashmir</SelectItem>
                                        <SelectItem value="JH">Jharkhand</SelectItem>
                                        <SelectItem value="KA">Karnataka</SelectItem>
                                        <SelectItem value="KL">Kerala</SelectItem>
                                        <SelectItem value="LD">Lakshadweep</SelectItem>
                                        <SelectItem value="MP">Madhya Pradesh</SelectItem>
                                        <SelectItem value="MN">Manipur</SelectItem>
                                        <SelectItem value="ML">Meghalaya</SelectItem>
                                        <SelectItem value="MZ">Mizoram</SelectItem>
                                        <SelectItem value="NL">Nagaland</SelectItem>
                                        <SelectItem value="OR">Odisha</SelectItem>
                                        <SelectItem value="PY">Puducherry</SelectItem>
                                        <SelectItem value="PB">Punjab</SelectItem>
                                        <SelectItem value="RJ">Rajasthan</SelectItem>
                                        <SelectItem value="SK">Sikkim</SelectItem>
                                        <SelectItem value="TN">Tamil Nadu</SelectItem>
                                        <SelectItem value="TG">Telangana</SelectItem>
                                        <SelectItem value="TR">Tripura</SelectItem>
                                        <SelectItem value="UT">Uttarakhand</SelectItem>
                                        <SelectItem value="WB">West Bengal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div >
                                <Label htmlFor="timezone" >Timezone</Label>
                                <Select
                                    onValueChange={(value) => setvalue({ target: { name: "timezone", value } })}
                                    value={value.timezone}
                                    name="timezone"
                                    id="timezone"
                                >
                                    <SelectTrigger className={'w-full'} >
                                        <SelectValue placeholder="Select timezone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="null">Select timezone</SelectItem>
                                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (UTC+05:30)</SelectItem>
                                        <SelectItem value="Africa/Abidjan">Africa/Abidjan (UTC+00:00)</SelectItem>
                                        <SelectItem value="Africa/Nairobi">Africa/Nairobi (UTC+03:00)</SelectItem>
                                        <SelectItem value="America/Los_Angeles">America/Los_Angeles (UTC-08:00)</SelectItem>
                                        <SelectItem value="America/New_York">America/New_York (UTC-05:00)</SelectItem>
                                        <SelectItem value="Asia/Dubai">Asia/Dubai (UTC+04:00)</SelectItem>
                                        <SelectItem value="Asia/Tokyo">Asia/Tokyo (UTC+09:00)</SelectItem>
                                        <SelectItem value="Australia/Sydney">Australia/Sydney (UTC+10:00)</SelectItem>
                                        <SelectItem value="Europe/London">Europe/London (UTC+00:00)</SelectItem>
                                        <SelectItem value="Europe/Paris">Europe/Paris (UTC+01:00)</SelectItem>
                                        <SelectItem value="Pacific/Auckland">Pacific/Auckland (UTC+12:00)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button className="flex w-full justify-center">
                            <WhatsAppSignupPopup prefill={value} />
                        </Button>
                    </article>
                </CardContent>
                <CardFooter> 
                <small className="text-center">All the following information is required to pre-fill and streamline the Facebook and WhatsApp Business onboarding process.</small>
                </CardFooter>
            </Card>

        )
    }
    const Step3 = () => {
        const tenantid = Number(getCookie('tenant_id'))
        const [loading, setLoading] = useState(false)
        const [payload, setpayload] = useState({
            tenant_id: tenantid,
            role_id: 1,
            first_name: "",
            last_name: "",
            email: '',
            password: ''
        })
        const [showPassword, setShowPassword] = useState(false);
        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };
        const handleProfileChange = (e) => {
            const { name, value } = e.target;
            setpayload(prev => ({
                ...prev,
                [name]: value
            }));
        }
        console.log(payload);
        const tenant_id = getCookie('tenant_id')
        console.log(tenant_id);
        
        const RegisterAdmin = async()=>{
            if(tenant_id){
                try {
                    setLoading(true)
                    const res = await userService.register(payload)
                    console.log('register',res)
                    if(res.success){
                        alert('Registerd sucessfully!')
                        console.log('Registerd sucessfully! login for dashboard');
                    }
                } catch (error) {
                    setLoading(false)
                }finally{
                    setLoading(false)
                }
            }else{
                alert('Connect whatsApp business with impretio in order to register as admin')
            }
        }
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Admin Details</CardTitle>
                    <CardDescription> Fill admin details here </CardDescription>
                </CardHeader>
                <CardContent>
                    <article className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="first_name" > first name </Label>
                                <Input type="text" placeholder="first name" id="first_name" name="first_name" value={payload.first_name ? payload.first_name : ""} onChange={(e) => handleProfileChange(e)} className="form-Input" required />
                            </div>
                            <div>
                                <Label htmlFor="last_name" > last name </Label>
                                <Input type="text" placeholder="last name" id="last_name" name="last_name" value={payload.last_name ? payload.last_name : ""} onChange={(e) => handleProfileChange(e)} className="form-Input" required />
                            </div>
                            <div>
                                <Label htmlFor="username" > Username or Email </Label>
                                <Input id="email" name="email" type="text" required value={payload.email} onChange={(e) => handleProfileChange(e)} className="form-Input" placeholder="Enter your username or email" disabled={loading} />
                            </div>
                            <div>
                                <Label htmlFor="password" >
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={payload.password} onChange={(e) => handleProfileChange(e)} className="form-Input pr-10" placeholder="Enter your password" disabled={loading} />
                                    <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2  hover:" disabled={loading} >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                            <div className="text-center">
                            <Button onClick={RegisterAdmin} className="w-full">{loading ?'Registering':'Register'}</Button>
                            </div>
                    </article>
                    <CardFooter className={'mt-10 text-center'}>
                        <small className="w-full text-center">The above user will be assigned as admin and owner of the account created with us with facebook business </small>
                    </CardFooter>
                </CardContent>
            </Card>
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
                <Stepper steps={steps}
                    value={profileForm}
                    setvalue={handleProfileChange}
                />
    )
}

export default CompanyForm