import React, { useState, useEffect } from 'react';
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

/**
 * Main application component with routing and authentication
 * Manages user state and provides authenticated routes
 */
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /**
   * Check if user is authenticated on app load
   */
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Verify current user authentication status
   */
  const checkAuthStatus = async () => {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      // User not authenticated, stay on login page
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle user login
   * @param {Object} credentials - User login credentials
   */
  const handleLogin = async (credentials) => {
    try {
      const userData = await userService.login(credentials);
      setUser(userData.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  const handleRegister = async(credentials)=>{
    try {
      const userData = await userService.register(credentials);
      setUser(userData.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    try {
      await userService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout on client side even if server request fails
      setUser(null);
    }
  };

  /**
   * Toggle sidebar visibility
   */
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show login page if user is not authenticated
  if (!user) {
    return <Login onRegister={handleRegister} onLogin={handleLogin} />;
  }

  // Main authenticated application layout
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={toggleSidebar}
          user={user}
        />
        
        {/* Main content area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-16'
        }`}>
          {/* Top header */}
          <Header 
            user={user}
            onLogout={handleLogout}
            onToggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
          
          {/* Page content */}
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/campaigns" element={<Campaigns user={user} />} />
              <Route path="/templates" element={<Templates user={user} />} />
              <Route path="/contacts" element={<Contacts user={user} />} />
              <Route path="/analytics" element={<Analytics user={user} />} />
              <Route path="/settings" element={<Settings user={user} onUserUpdate={setUser} />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;