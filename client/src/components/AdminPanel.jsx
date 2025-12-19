import React, { useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    trackingId: '',
    weight: '',
    sourcePincode: '',
    destPincode: '',
    postType: 'Normal',
    senderName: 'Admin',
    recipientName: 'User',
    currentLocation: 'Sorting Hub'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Connect to your Backend API
      const res = await axios.post('http://localhost:5000/api/create', formData);
      if(res.data.success) {
        alert("✅ Consignment Registered Successfully!");
      }
    } catch (error) {
      alert("❌ Error: " + (error.response?.data?.error || "Server Down"));
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl border-t-4 border-red-700">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-red-700 text-white p-2 rounded-lg mr-3 text-sm">ADMIN</span>
        New Consignment Entry
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Row 1: ID & Type */}
        <div className="col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Scan Barcode / Enter ID</label>
          <input 
            type="text" 
            name="trackingId"
            placeholder="Scan or Type ID..." 
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-xl font-mono focus:border-red-600 focus:outline-none"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Post Type</label>
          <select name="postType" onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-3">
            <option value="Normal">Normal Post</option>
            <option value="Speed Post">Speed Post (Priority)</option>
            <option value="Prime">Amazon Prime (Next Day)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Weight (kg)</label>
          <input type="number" name="weight" placeholder="0.5" className="w-full border border-gray-200 rounded-lg px-4 py-3" onChange={handleChange} />
        </div>

        {/* Row 2: Locations */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Source Pincode</label>
          <input type="text" name="sourcePincode" placeholder="e.g. 110001" className="w-full border border-gray-200 rounded-lg px-4 py-3" onChange={handleChange} />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Destination Pincode</label>
          <input type="text" name="destPincode" placeholder="e.g. 560001" className="w-full border border-gray-200 rounded-lg px-4 py-3" onChange={handleChange} />
        </div>

        <button className="col-span-2 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition">
          Register Consignment
        </button>

      </form>
    </div>
  );
};

export default AdminPanel;