import React from 'react'
import CompanyForm from './company-form'
import { Link } from 'react-router-dom'
import { ModeToggle } from '@/components/mode-toggle'

const CompanySignup= () => {
  return (
    <div className='flex flex-col justify-between align-items-center w-full min-h-[100vh]'>
      <nav className='flex w-full items-center justify-between p-4'>
        <img className='logo-md' src="/assets/icons/logo.png" />
        <ModeToggle/>
      </nav>
      <CompanyForm />
      <div className='text-center mt-5'>
        <small>Already have an account? <Link to='/login' className="" >login</Link></small>
      </div>
      <footer className='flex justify-between items-center w-full p-4'>
        <div className="text-center mt-6 text-sm  w-full">
          <p className="mb-2">
            <span>Impretio</span> is a Meta-certified tech provider. We help businesses manage their
            <span>WhatsApp</span>,
            <span>Instagram</span>, and
            <span>Facebook</span> marketing campaigns.
          </p>
          <p className="mt-2">
            By continuing, you agree to our{' '}
            <Link to="/terms_and_conditions" className="text-primary hover:underline">Terms & Conditions</Link> and{' '}
            <Link to="/privacy_policy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </div>

      </footer>
    </div>
  )
}

export default CompanySignup