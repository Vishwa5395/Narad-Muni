import React, { useState } from 'react';
import axios from 'axios';
import MapComponent from './MapComponent.jsx'; // We will create this next
import { jsPDF } from "jspdf";

const Tracking = () => {
  const [id, setId] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    setData(null);

    try {
      // connecting to the backend we built earlier
      const res = await axios.get(`http://localhost:4000/api/consignment/track/${id}`);
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Consignment number not found.");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if(!data) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`India Post Receipt`, 10, 20);
    doc.setFontSize(12);
    doc.text(`Consignment ID: ${data.consignmentId}`, 10, 40);
    doc.text(`Status: ${data.status}`, 10, 50);
    doc.text(`From: ${data.senderDetails?.address}`, 10, 60);
    doc.text(`To: ${data.recipientDetails?.address}`, 10, 70);
    doc.text(`ETA: ${new Date(data.estimatedDeliveryDate).toDateString()}`, 10, 80);
    doc.save(`receipt_${data.consignmentId}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Track Consignment</h2>
      
      {/* Search Bar */}
      <div className="flex gap-4 mb-8">
        <input 
          className="flex-1 border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:border-red-600 text-lg" 
          value={id} 
          onChange={(e) => setId(e.target.value)} 
          placeholder="Enter Consignment Number..." 
        />
        <button 
          onClick={handleTrack} 
          disabled={loading}
          className="bg-red-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-800 disabled:bg-gray-400"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {data && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6 grid md:grid-cols-2 gap-8">
            
            {/* Left: Details */}
            <div>
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${data.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {data.status}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Package Details</h3>
              <p className="text-gray-600 mb-1"><strong>Type:</strong> {data.packageDetails?.type}</p>
              <p className="text-gray-600 mb-1"><strong>Weight:</strong> {data.packageDetails?.weight}kg</p>
              
              <div className="my-4 border-t pt-4">
                <p className="text-gray-800"><strong>Estimated Arrival:</strong> <br/>{new Date(data.estimatedDeliveryDate).toDateString()}</p>
                {data.predictedDelay > 0 && (
                  <p className="text-red-600 text-sm mt-1 font-semibold">
                    ⚠️ Delay of {data.predictedDelay} hrs expected due to {data.weatherCondition || 'weather'}.
                  </p>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={generatePDF} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black text-sm">
                  Download Receipt
                </button>
              </div>
            </div>
            
            {/* Right: Map */}
            <div className="h-64 bg-gray-100 rounded-lg overflow-hidden relative">
              <MapComponent 
                 lat={data.currentLocation?.latitude || 20.5937} 
                 lng={data.currentLocation?.longitude || 78.9629} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;