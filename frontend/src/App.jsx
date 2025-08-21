import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { userService } from './services/api';
import Login from './pages/login';
import Dashboard from './pages/dashboard.jsx';
import Campaigns from './pages/campaigns';
import Templates from './pages/templates';
import Contacts from './pages/contacts';
import Settings from './pages/settings';
import Sidebar from './components/sidebar';
import Header from './components/header';
import LoadingSpinner from './components/loading-spinner';
import PrivacyPolicy from './pages/privacy-policy';
import TermsOfService from './pages/terms-of-service';
const CompanyLayout = lazy(() => import("./company/layout"))
const CompanyProfile = lazy(() => import('./company/company-profile'))


const Layout = lazy(() => import('./layout'))

function App() {

  return (
    <Suspense fallback={<><LoadingSpinner /></>}>
      <Router>
        {/* Page content */}
        <Routes>
          <Route path='/company' element={<CompanyLayout />}>
            <Route path='/company/profile' element={<CompanyProfile />} />
          </Route>
          <Route path='/privacy_policy' element={<PrivacyPolicy />} />
          <Route path='/terms_and_conditions' element={<TermsOfService />} />
          <Route path='/' element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>

        </Routes>

      </Router>
    </Suspense>
  );
}

export default App;