import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { AlertCircle, Key, Save, Smartphone, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import {country,state,business_categories,timezones} from '../../data.json'
import { tenantService } from '@/services/api';

const CompanyProfile = () => {
const tenant = useSelector(state=>state.data.tenant)
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  // useEffect(() => {
  //   const getTenantDetails = async () => {
  //     try {
  //       setLoading(true)
  //       const res = await tenantService.tenantById();
  //       console.log(res);
        
  //       setProfileForm(res.data);
  //     } catch (err) {
  //       setLoading(false)
  //       setError(`Failed to update profile: ${err.message}`);
  //     } finally {
  //       setLoading(false)
  //       setSaving(false);
  //     }
  //   };
  //   getTenantDetails()
  // }, [])

// Bussiness form state
  const [profileForm, setProfileForm] = useState({
    id: tenant?.id || "",
    business_name: tenant?.business_name || "",
    business_email: tenant?.business_email || "",
    display_name: tenant?.display_name || "",
    website_url: tenant?.website_url || "",
    country:tenant?.country || "",
    state:tenant?.state,
    business_category:tenant?.business_category || "",
    timezone:tenant?.timezone || ""

  })
console.log(tenant);

  return (
    <section>
      <Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/dashboard">dashboard</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>company profile</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>

    <main className='flex justify-center mx-auto w-full mt-10'>

      <Card className={'min-w-xl max-w-[80%]'}>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Update your account profile and business information</CardDescription>
        </CardHeader>
        <CardContent>
       <div className="card-body">
                {
                  loading ? <LoadingSpinner /> :
                    <article className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="business_email" > Business Email </Label>
                          <Input type="email" id="business_email" name="business_email" value={profileForm.business_email} onChange={(e) => handleProfileChange(e)} className="form-Input" required />
                        </div>

                        <div>
                          <Label htmlFor="business_name" > Business Name </Label>
                          <Input type="text" id="business_name" name="business_name" value={profileForm.business_name} onChange={(e) => handleProfileChange(e)} className="form-Input" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="display_name" > Business Display Name </Label>
                        <Input type="text" id="display_name" name="display_name" value={profileForm.display_name} onChange={(e) => handleProfileChange(e)} className="form-Input" />
                      </div>
                      <div>
                        <Label htmlFor="website_url" > Website URL </Label>
                        <Input type="text" id="website_url" name="website_url" value={profileForm.website_url} onChange={(e) => handleProfileChange(e)} className="form-Input" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="country" >Country</Label>
                              <Select name='company.country' value={profileForm.country}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Country</SelectLabel>
                                    {country.map((item)=>(  
                                        <SelectItem value={item.value}>{item.title}</SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                          </div>
                            <div>
                          <Label htmlFor="state" >State</Label>
                          <Select name='company.state' value={profileForm.state}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>State</SelectLabel>
                                    {state.map((item)=>(  
                                        <SelectItem value={item.value}>{item.title}</SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              </div>
                        <div>
                          <Label htmlFor="business_category" >Business Category</Label>
                                <Select name='country.business_category' value={profileForm.business_category} >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a Business Category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>State</SelectLabel>
                                    {business_categories.map((item)=>(  
                                        <SelectItem value={item.value}>{item.title}</SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                        </div>
                        
                        <div className='select-wrapper'>
                          <Label htmlFor="timezone" >Timezone</Label>
                          <Select name='country.timezone' value={profileForm.timezone}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Time Zones</SelectLabel>
                                    {timezones.map((item)=>(  
                                        <SelectItem value={item.value}>{item.title}</SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button className='w-full' onClick={() => handleProfileSubmit()} disabled={saving} >
                          {saving ? (
                            <>
                              <LoadingSpinner size="sm" />
                              Saving...
                            </>
                          ) : (
                            <>
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </article>

                }
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
              </div>
        </CardContent>
        <CardFooter>

        </CardFooter>
      </Card>
  </main>
</section>
  )
}

export default CompanyProfile