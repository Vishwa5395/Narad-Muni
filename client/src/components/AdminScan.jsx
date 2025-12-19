import React, { useState } from 'react';
import axios from 'axios';

const AdminScan = () => {
  const [formData, setFormData] = useState({
    consignmentId: '',
    senderName: '',
    senderPincode: '',
    recipientName: '',
    recipientPincode: '',
    weight: '',
    type: 'Normal Post'
  });
  const [status, setStatus] = useState(null); // success or error message

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', msg: 'Processing...' });

    try {
      // Construct the payload as expected by the backend model
      const payload = {
        consignmentId: formData.consignmentId,
        senderDetails: { name: formData.senderName, pincode: formData.senderPincode, address: "Admin Scan Location" },
        recipientDetails: { name: formData.recipientName, pincode: formData.recipientPincode, address: "Destination" },
        packageDetails: { weight: formData.weight, type: formData.type }
      };

      await axios.post('http://localhost:4000/api/consignment/create', payload);
      setStatus({ type: 'success', msg: 'Consignment Created Successfully!' });
      
      // Reset form
      setFormData({
        consignmentId: '', senderName: '', senderPincode: '',
        recipientName: '', recipientPincode: '', weight: '', type: 'Normal Post'
      });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', msg: 'Failed to create consignment. Check server.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-red-700">Admin: New Consignment Scan</h2>
      
      {status && (
        <div className={`p-3 mb-4 rounded ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold text-gray-700">Consignment ID (Barcode)</label>
          <input 
            name="consignmentId" required
            value={formData.consignmentId} onChange={handleChange}
            className="w-full border p-2 rounded focus:border-red-500 outline-none"
            placeholder="Scan or Type ID"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Sender Name</label>
            <input name="senderName" value={formData.senderName} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Sender Pincode</label>
            <input name="senderPincode" value={formData.senderPincode} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Recipient Name</label>
            <input name="recipientName" value={formData.recipientName} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Recipient Pincode</label>
            <input name="recipientPincode" value={formData.recipientPincode} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-sm text-gray-600">Weight (kg)</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Post Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="Normal Post">Normal Post</option>
              <option value="Speed Post">Speed Post</option>
            </select>
          </div>
        </div>

        <button type="submit" className="w-full bg-red-700 text-white font-bold py-3 rounded hover:bg-red-800 transition">
          Register Consignment
        </button>
      </form>
    </div>
  );
};

export default AdminScan;