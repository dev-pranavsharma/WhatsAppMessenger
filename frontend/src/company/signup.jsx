import React from 'react'
import CompanyForm from './company-form'
import { Link } from 'react-router-dom'

const CompanySignup= () => {
  return (
    <div className=' min-h-screen'>
      <nav className='flex w-full justify-center items-center p-4'>
        <img className='logo-md' src="/assets/icons/logo.png" />
      </nav>
      <h2 className="text-foreground text-center ">Create your Account with Impretio</h2>
      <p className=" text-foreground text-center">and make your marketing journey smooth.</p>
      <div className='grid grid-cols-2 gap-10 m-10'>
            <div className='flex gap-10 justify-center'>
            <img className='w-auto h-[30rem] rounded-md shadow' src='/assets/images/wa-screen-1.png'/>
            <img className='w-auto h-[30rem] rounded-md shadow' src='/assets/images/wa-screen-2.png'/>
            </div>
            <div className=''>
              <CompanyForm />
            </div>
       
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