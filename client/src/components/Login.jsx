import React, { useState } from 'react';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // HARDCODED LOGIC FOR DEMO
    // In real app, this would verify with backend
    if (email === 'admin@post.com' && password === 'admin') {
      onLogin('admin'); // Log in as Admin
    } else {
      onLogin('user'); // Log in as User
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login to Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
            placeholder="admin@post.com for Admin"
            required 
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
            placeholder="admin for Admin"
            required 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-red-700 text-white font-bold py-2 px-4 rounded hover:bg-red-800 transition duration-200"
        >
          Sign In
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          New User?{' '}
          <button onClick={onSwitchToSignup} className="text-red-700 font-bold hover:underline">
            Register Here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;