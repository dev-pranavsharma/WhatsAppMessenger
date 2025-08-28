import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { userService } from './services/api';
import Login from './pages/login';
import Dashboard from './pages/dashboard.jsx';
import Campaigns from './pages/campaigns';
import Templates from './pages/templates';
import Contacts from './pages/contacts';
import Settings from './pages/settings';
import LoadingSpinner from './components/loading-spinner';
import PrivacyPolicy from './pages/privacy-policy';
import TermsOfService from './pages/terms-of-service';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountryCodes, fetchGenders } from './redux/slices/libSlice';
const CompanyLayout = lazy(() => import("./company/layout"))
const CompanySignup = lazy(() => import('./company/signup'))
const CompanyProfile =  lazy(()=>import('./company/profile'))
const AddContact = lazy(()=>import('./contacts/add-contact'))



const Layout = lazy(() => import('./layout'))

function App() {

  const dispatch = useDispatch()
  const { genders,countryCodes, loading, error } = useSelector((state) => state.lib)
  // const { countryCodes, loading, error } = useSelector((state) => state.lib)

    useEffect(() => {
      if(genders.length==0){
        dispatch(fetchGenders())
      }
      if(countryCodes.length==0){
        dispatch(fetchCountryCodes())
      }
    }, [dispatch])

    console.log(loading,genders);
    console.log(loading,countryCodes);
    

  return (
    <Suspense fallback={<><LoadingSpinner /></>}>
      <Router>
        {/* Page content */}
        <Routes>
          <Route path='/company' element={<CompanyLayout />}>
            <Route path='/company/signup' element={<CompanySignup />} />
          </Route>
          <Route path='/privacy_policy' element={<PrivacyPolicy />} />
          <Route path='/terms_and_conditions' element={<TermsOfService />} />
          <Route path='/' element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/add" element={<AddContact />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route path='/company/profile' element={<CompanyProfile />} />
          </Route>

        </Routes>

      </Router>
    </Suspense>
  );
}

export default App;