import React from 'react';
import { FaEnvelopeOpenText } from 'react-icons/fa';

const Header = ({ isLoggedIn, onLogout, currentView, onViewChange }) => {
  const navItemClass = (viewName) => 
    `text-sm font-medium cursor-pointer transition ${
      currentView === viewName 
        ? 'text-red-700 font-bold' 
        : 'text-gray-500 hover:text-red-600'
    }`;

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 sticky top-0 z-50">
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center space-x-3 text-red-700 cursor-pointer" onClick={() => onViewChange('tracking')}>
          <FaEnvelopeOpenText className="text-3xl" />
          <span className="font-bold text-2xl tracking-tight">
            India Post <span className="text-gray-400 font-normal text-sm ml-2 hidden sm:inline">Smart Portal</span>
          </span>
        </div>
        
        {/* Center Navigation (Only visible if logged in) */}
        {isLoggedIn && (
          <nav className="hidden md:flex space-x-8">
            <span onClick={() => onViewChange('tracking')} className={navItemClass('tracking')}>Home</span>
            <span onClick={() => onViewChange('tracking')} className={navItemClass('tracking')}>Track Parcel</span>
            <span onClick={() => alert("Dashboard Coming in Phase 2!")} className={navItemClass('dashboard')}>Dashboard</span>
          </nav>
        )}

        {/* Right Side Buttons */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <button 
              onClick={onLogout} 
              className="bg-red-50 text-red-700 px-5 py-2 rounded-full text-sm font-bold hover:bg-red-100 transition"
            >
              Logout
            </button>
          ) : (
            <span className="text-xs text-gray-400 font-mono">v1.0.0 Alpha</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;