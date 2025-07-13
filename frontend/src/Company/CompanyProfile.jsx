import React from 'react'
import CompanyForm from './CompanyForm'
import { Link } from 'react-router-dom'

const CompanyProfile = () => {
  return (
    <div className='flex flex-col justify-between align-items-center w-full min-h-[100vh]'>
      <nav className='flex w-full items-center justify-center p-4'>
        <img className='logo-md' src="/assets/icons/logo.png" />
      </nav>
      <CompanyForm />
      <div className='text-center mt-5'>
        <small>Already have an account? <Link to='/login' className="text-primary hover:underline" >login</Link></small>
      </div>
      <footer className='flex justify-between items-center w-full p-4'>
        <div className="text-center mt-6 text-sm text-gray-500 w-full">
          <p className="mb-2">
            <span className="text-primary font-semibold">Impretio</span> is a Meta-certified tech provider. We help businesses manage their
            <span className="text-primary font-medium"> WhatsApp</span>,
            <span className="text-primary font-medium"> Instagram</span>, and
            <span className="text-primary font-medium"> Facebook</span> marketing campaigns.
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

export default CompanyProfile