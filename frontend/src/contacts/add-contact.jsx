import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import { Link } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { useEffect, useState } from 'react'
import { ContactServices, libraryService } from '@/services/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircleIcon, CheckCircle2Icon, Loader2Icon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'


const AddContact = () => {
  const queryClient = useQueryClient()
  const session = queryClient.getQueryData(['session'])
  const countryCodes = queryClient.getQueryData(['countryCodes'])
  const genders = queryClient.getQueryData(['genders'])
  const tenant = session?.tenant
  const phone_numbers = queryClient.getQueryData(["phoneNumbers"]);
  const { data: active_phone_number } = useQuery({
    queryKey: ['active_phone_number'],
    queryFn: () => undefined,
    enabled: false,
  })


  const form = useForm({
    defaultValues: {
      t_id: tenant?.id,
      waba_id: tenant?.waba_id,
      pn_id: '',
      gender: '',
      full_name: '',
      country_code: '+91',
      phone_number: '',
      email: '',
      personal_details: {
        occupation: '',
        birthday: '',
        company_name: '',
        engagement: '',
        anniversary: ''
      },
      address_details: {
        address_line_1: '',
        address_line_2: '',
        state: '',
        country_code: 'IN',
        city: '',
        pincode: '',
      }
    }
  }
  )


  useEffect(() => {
    form.setValue("pn_id", active_phone_number?.id || '', {
      shouldValidate: true,
      shouldDirty: true,
    })
  }, [active_phone_number?.id])

  const [message, setMessage] = useState()
  // mutation for POST request
  const addContactMutation = useMutation({
    mutationFn: (data) => ContactServices.addContact(data),
    onSuccess: () => {
      setMessage(
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>Success! Contact have been saved successfully</AlertTitle>
          <AlertDescription>
            You may check the added contact in contacts list
          </AlertDescription>
        </Alert>
      )
      form.reset({
        t_id: tenant?.id,
        waba_id: tenant?.waba_id,
        pn_id: '',
        gender: '',
        full_name: '',
        country_code: '+91',
        phone_number: '',
        email: '',
        personal_details: {
          occupation: '',
          birthday: '',
          company_name: '',
          engagement: '',
          anniversary: ''
        },
        address_details: {
          address_line_1: '',
          address_line_2: '',
          state: '',
          country_code: 'IN',
          city: '',
          pincode: '',
        }
      })
    },
    onError: (error) => {
      setMessage(
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Failed! Unable to save the contact details</AlertTitle>
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
      )
      console.error("Failed to add contact", error)
    },
  })

  const AddContact = async (value) => {
    addContactMutation.mutate(value)
  }
  console.log(message);


  // console.log(form.watch());
  // console.log(genders,countryCodes);
  // console.log(active_phone_number);


  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/contacts">Contacts</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Contact</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className={'mt-10'}>
        <CardHeader>
          <CardTitle>Add contact for {active_phone_number?.verified_name}</CardTitle>
          <CardDescription>Fill the details of the contact</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className='space-y-6' onSubmit={form.handleSubmit(AddContact)}>
              <FormField
                control={form.control}
                name="pn_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <FormControl>
                        <Select value={field.value ?? ''} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>locations</SelectLabel>
                              {
                                phone_numbers && phone_numbers.map(({ verified_name, id }) => (
                                  <SelectItem key={id} value={id}>{verified_name}</SelectItem>
                                ))
                              }
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-4 gap-5 mt-5'>
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Code</FormLabel>
                      <FormControl>
                        <Select value={field.value ?? ''} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Phone Code" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Phone Codes</SelectLabel>
                              {
                                countryCodes && countryCodes.map(({ code, country }) => (
                                  <SelectItem key={code} value={code}>{country}</SelectItem>
                                ))
                              }
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="10 digit phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email ID</FormLabel>
                      <FormControl>
                        <Input placeholder="email of contact" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value ?? ''}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Select Gender</SelectLabel>
                              {
                                genders && genders.map(({ code, label }) => (
                                  <SelectItem key={code} value={code}>{label}</SelectItem>
                                ))
                              }
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Accordion type='single' collapsible className='w-full'>
                <AccordionItem value='AddressDetails'>
                  <AccordionTrigger><h4>+ Address Details</h4></AccordionTrigger>
                  <AccordionContent>
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 mt-4">
                      <FormField
                        control={form.control}
                        name="address_details.address_line_1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address line 1</FormLabel>
                            <FormControl>
                              <Input placeholder="type your address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address_details.address_line_2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address line 2</FormLabel>
                            <FormControl>
                              <Input placeholder="type your address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid lg:grid-cols-4 grid-cols-2 gap-5 mt-4">
                      <FormField
                        control={form.control}
                        name="address_details.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="type your city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address_details.pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode</FormLabel>
                            <FormControl>
                              <Input type={'number'} placeholder="type your pincode" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address_details.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="type your state" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address_details.country_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <FormControl>
                                <Select value={field.value ?? ''} onValueChange={field.onChange}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Country" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Countries</SelectLabel>
                                      {
                                        countryCodes && countryCodes.map(({ iso2, country }) => (
                                          <SelectItem value={iso2}>{country}</SelectItem>
                                        ))
                                      }
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type='single' collapsible className='w-full'>
                <AccordionItem value='PersonalDetails'>
                  <AccordionTrigger><h4>+ Additional Information</h4></AccordionTrigger>
                  <AccordionContent className="grid lg:grid-cols-4 grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="personal_details.occupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation</FormLabel>
                          <FormControl>
                            <Input placeholder="your occupation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personal_details.birthday"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birthday</FormLabel>
                          <FormControl>
                            <Input type={'date'} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personal_details.engagement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Engagement</FormLabel>
                          <FormControl>
                            <Input type={'date'} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personal_details.anniversary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anniversary</FormLabel>
                          <FormControl>
                            <Input type={'date'} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personal_details.company_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder='your company name' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {
                addContactMutation.isPending ?
                  <Button disabled>
                    <Loader2Icon className="animate-spin" />
                    logging
                  </Button>
                  : <Button type="submit">Submit</Button>
              }
              {message}
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}

export default AddContact