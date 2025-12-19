import React, { useState } from 'react';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-red-700 px-8 py-6 text-white text-center">
        <h2 className="text-2xl font-bold">Welcome Back</h2>
        <p className="text-red-100 text-sm mt-1">Login to your smart dashboard</p>
      </div>
      
      <div className="p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email / ID</label>
            <input 
              type="text" 
              required 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-red-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
            <input 
              type="password" 
              required 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-red-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition">
            Sign In Securely
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account? 
            <button onClick={onSwitchToSignup} className="text-red-700 font-bold hover:underline ml-2">
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;