import React, { useState } from 'react';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import Tracking from './components/Tracking';

function App() {
  const [currentView, setCurrentView] = useState('login'); // Start at login
  const isLoggedIn = currentView === 'tracking' || currentView === 'dashboard';

  return (
    <div className="bg-white font-sans min-h-screen text-gray-900">
      <Header 
        isLoggedIn={isLoggedIn} 
        onLogout={() => setCurrentView('login')} 
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      <main>
        {currentView === 'login' && (
          <div className="container mx-auto px-4 py-12">
            <Login 
              onLogin={() => setCurrentView('tracking')} 
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

        {currentView === 'tracking' && (
          <Tracking />
        )}
      </main>
    </div>
  );
}

export default App;