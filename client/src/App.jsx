import React, { useState } from 'react';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import Tracking from './components/Tracking'; // Ensure this matches your file name (e.g., TrackParcel.js)
import AdminScan from './components/AdminScan'; // New Admin Component

function App() {
  const [currentView, setCurrentView] = useState('login'); // login, signup, tracking, admin-scan
  
  // Define what counts as "Logged In" to change Header appearance
  const isLoggedIn = currentView === 'tracking' || currentView === 'admin-scan';

  // Enhanced Login Handler: Accepts a role to determine destination
  const handleLogin = (role) => {
    if (role === 'admin') {
      setCurrentView('admin-scan');
    } else {
      setCurrentView('tracking');
    }
  };

  return (
    <div className="bg-white font-sans min-h-screen text-gray-900">
      <Header 
        isLoggedIn={isLoggedIn} 
        onLogout={() => setCurrentView('login')} 
        currentView={currentView}
        onViewChange={setCurrentView} // Allows navigation between pages if needed
      />

      <main>
        {/* --- Authentication Views --- */}
        {currentView === 'login' && (
          <div className="container mx-auto px-4 py-12">
            <Login 
              onLogin={handleLogin} // Passes role back to App
              onSwitchToSignup={() => setCurrentView('signup')} 
            />
          </div>
        )}

        {currentView === 'signup' && (
           <div className="container mx-auto px-4 py-12">
            <Signup 
              onSwitchToLogin={() => setCurrentView('login')} 
            />
          </div>
        )}

        {/* --- User View: Tracking --- */}
        {currentView === 'tracking' && (
          <div className="container mx-auto px-4 py-6">
            <Tracking />
          </div>
        )}

        {/* --- Admin View: Scanning --- */}
        {currentView === 'admin-scan' && (
          <div className="container mx-auto px-4 py-6">
            <AdminScan />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;