import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { userService } from './services/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import Templates from './pages/Templates';
import Contacts from './pages/Contacts';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
const CompanyLayout = lazy(()=>import("./Company/Layout"))
const CompanyProfile = lazy(()=>import('./Company/CompanyProfile'))


const Layout = lazy(()=>import('./layout'))

function App() {
 
  return (
    <Suspense fallback={<><LoadingSpinner/></>}>
    <Router>
          {/* Page content */}
            <Routes>
              <Route path='/company' element={<CompanyLayout/>}>
                <Route path='/company/profile' element={<CompanyProfile/>}/>
              </Route>
              <Route path='/privacy_policy' element={<PrivacyPolicy/>}/>
              <Route path='/terms_and_conditions' element={<TermsOfService/>}/>
              <Route path='/' element={<Layout/>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard/>} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/templates" element={<Templates  />} />
              <Route path="/contacts" element={<Contacts  />} />
              <Route path="/analytics" element={<Analytics  />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>

            </Routes>

    </Router>
    </Suspense>
  );
}

export default App;