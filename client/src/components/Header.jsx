import React from 'react';

const Header = ({ isLoggedIn, onLogout, currentView, onViewChange }) => {
  return (
    <header className="bg-red-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => !isLoggedIn && onViewChange('login')}>
          {/* Simple Text Logo for now */}
          <h1 className="text-2xl font-bold tracking-wider">INDIA POST <span className="text-sm font-light">Logistic Service</span></h1>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-6 items-center">
            {!isLoggedIn ? (
              <>
                <li>
                  <button 
                    onClick={() => onViewChange('login')}
                    className={`hover:text-red-200 ${currentView === 'login' ? 'font-bold underline' : ''}`}
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onViewChange('signup')}
                    className={`hover:text-red-200 ${currentView === 'signup' ? 'font-bold underline' : ''}`}
                  >
                    Signup
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Show different links based on view */}
                {currentView === 'admin-scan' ? (
                   <span className="bg-white text-red-700 px-3 py-1 rounded text-sm font-bold">ADMIN MODE</span>
                ) : (
                   <span className="text-red-100 italic">User Tracking</span>
                )}
                
                <li>
                  <button 
                    onClick={onLogout}
                    className="bg-white text-red-700 px-4 py-2 rounded hover:bg-red-50 transition font-medium"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;