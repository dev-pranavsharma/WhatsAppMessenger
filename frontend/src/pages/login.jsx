import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Eye, EyeOff, Loader2Icon } from 'lucide-react';
import LoadingSpinner from '../components/loading-spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handle form input changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await onLogin(formData);

      if (!result.success) {
        setError(result.error || (isRegister ? 'Registration failed' : 'Login failed'));
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  console.log(formData);

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Switch between login and register modes
   */
  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setFormData({ username: '', password: '' });
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
            <form className="flex-col" onSubmit={handleSubmit}>
              <div className="space-y-10">
                {/* Username Field */}
                <div>
                  <Label htmlFor="email"> Email </Label>
                  <Input id="email" name="email" type="text" required value={formData.email} onChange={handleChange} className="form-input" placeholder="Enter your email" disabled={loading} />
                </div>

                {/* Password Field */}
                <div>
                  <Label htmlFor="password"> Password </Label>
                  <div className="relative flex gap-x-5">
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange} className="form-input pr-10" placeholder="Enter your password" disabled={loading} />
                    <Button type="button" className='absolute right-0' variant='ghost' onClick={togglePasswordVisibility} disabled={loading} >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {
                  loading ? (
                    <Button disabled className='w-full'>
                      <Loader2Icon className="animate-spin" />
                      logging
                    </Button>
                  ) : (
                    <Button className='w-full' type="submit"> log in </Button>
                  )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="alert alert-error">
                  {error}
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className=''>
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