import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Eye, EyeOff, Loader2Icon } from 'lucide-react';
import LoadingSpinner from '../components/loading-spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const Login = ({ onLogin ,loading }) => {
  const navigate = useNavigate()
  const query = useQueryClient()
  const form = useForm({
    defaultValues:{
      email: null,
      password: null
    }
  })
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (values) => {
    onLogin(values);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div className="min-h-screen bg-background text-foreground flex gap-10">
      <div className="w-7/12 flex flex-col justify-between p-10 border-r border-forground">
        {/* Header */}
        <div className="">
          <img src='/assets/icons/logo.png' className="w-48 h-auto" />
        </div>
        <div>
          <h1 className="max-w-[80%]"> Manage your Marketing Campaign and Reputation Management With Impretio </h1>
          {/* Features List */}
          <div className="mt-5">
            <ul className="space-y-2 text-sm ">
              <li className="flex items-center gap-2">
                WhatsApp Business API integration
              </li>
              <li className="flex items-center gap-2">
                Campaign management and scheduling
              </li>
              <li className="flex items-center gap-2">
                Message template creation
              </li>
              <li className="flex items-center gap-2">
                Contact management and segmentation
              </li>
              <li className="flex items-center gap-2">
                Performance analytics and reporting
              </li>
            </ul>
          </div>
        </div>
        <p className='text-gray-400'> Please read <Link target='__blank' to='/privacy_policy'>privacy policy</Link> and <Link target='__blank' to='terms_and_conditions'>terms and conditions</Link></p>
      </div>
      {/* Login Form */}
      <div className='w-5/12 flex flex-col justify-center items-center'>
        <h2 className='text-left mb-3'>Login </h2>
        <Card className='min-w-lg max-w-xl'>
          <CardHeader>
            <CardTitle>Impretio</CardTitle>
            <CardDescription>Login in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" required placeholder="Enter your email" disabled={loading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Password Field */}
                 <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                    <div className='relative'>
                    <Input {...field} id="password" name="password" type={showPassword ? 'text' : 'password'} required placeholder="Enter your password" disabled={loading} />
                    <Button type="button" className='absolute top-0 cursor-pointer right-0' variant='ghost' onClick={togglePasswordVisibility} disabled={loading} >
                      {showPassword && showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 
                {
                  loading ? (
                    <Button disabled className='w-full'>
                      <Loader2Icon className="animate-spin" />
                      logging
                    </Button>
                  ) : (
                    <Button variant='default' className='w-full' type="submit"> Log In </Button>
                  )}
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button className='w-full' variant='secondary' asChild>
              <Link to='/company/signup'>Don't have an account? Create one</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>


    </div>
  );
};

export default Login;