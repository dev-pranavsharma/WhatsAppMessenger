import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '../components/loading-spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';

const Login = ({ onLogin,onRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);

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
    const result = isRegister
      ? await onRegister(formData)   // call registration handler
      : await onLogin(formData);     // call login handler

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
    <div className="min-h-screen  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 -600 rounded-2xl flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold ">
            WhatsApp Campaign Manager
          </h1>
          <p className="mt-2 ">
            {isRegister ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>    

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="text"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative flex gap-x-5">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input pr-10"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <Button
                  onClick={togglePasswordVisibility}
                  disabled={loading}  
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>  
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary btn-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                <span>{isRegister ? 'Creating Account...' : 'Signing In...'}</span>
              </div>
            ) : (
              <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
            )}
          </Button>

          {/* Toggle between login and register */}
          <div className="text-center">
            <Link to='/company/profile'>Don't have an account? Create one</Link>
            {/* <button
              type="button"
              onClick={toggleMode}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              disabled={loading}
            >
              {isRegister 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Create one"
              }
            </button> */}
          </div>
        </form>

        {/* Features List */}
        <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-medium  mb-4">Features included:</h3>
          <ul className="space-y-2 text-sm ">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 -600 rounded-full"></div>
              WhatsApp Business API integration
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 -600 rounded-full"></div>
              Campaign management and scheduling
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 -600 rounded-full"></div>
              Message template creation
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 -600 rounded-full"></div>
              Contact management and segmentation
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 -600 rounded-full"></div>
              Performance analytics and reporting
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;