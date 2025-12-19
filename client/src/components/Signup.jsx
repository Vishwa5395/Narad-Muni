import React from "react";

const Signup = ({ onSwitchToLogin }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSwitchToLogin();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-600">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Create Account
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Email
          </label>
          <input
            type="email"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Create Password
          </label>
          <input
            type="password"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition"
          />
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg">
          Sign Up
        </button>
      </form>

      <p className="text-center text-sm mt-6 text-gray-600">
        Already a user?
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 font-bold hover:underline ml-1"
        >
          Log In
        </button>
      </p>
    </div>
  );
};

export default Signup;
