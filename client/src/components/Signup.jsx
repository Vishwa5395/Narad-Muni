import React from 'react';

const Signup = ({ onSwitchToLogin }) => {
  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h2>
      <p className="text-center text-gray-500 mb-4">Registration is currently disabled for this demo.</p>
      
      <button 
        onClick={onSwitchToLogin}
        className="w-full bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300 transition duration-200"
      >
        Back to Login
      </button>
    </div>
  );
};

export default Signup;