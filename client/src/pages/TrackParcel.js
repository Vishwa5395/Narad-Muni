import React, { useState } from 'react';
import axios from 'axios';
import MapComponent from '../components/MapComponent';
import { jsPDF } from "jspdf";

const TrackParcel = () => {
  const [id, setId] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    try {
      // Validate format locally first (e.g., must be alphanumeric)
      if(!/^[a-zA-Z0-9]+$/.test(id)) return setError("Invalid format");

      const res = await axios.get(`http://localhost:4000/api/track/${id}`);
      setData(res.data.data);
      setError('');
    } catch (err) {
      setError("Consignment not found");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Receipt for: ${data.consignmentId}`, 10, 10);
    doc.text(`Status: ${data.status}`, 10, 20);
    doc.text(`ETA: ${new Date(data.estimatedDeliveryDate).toDateString()}`, 10, 30);
    doc.save("receipt.pdf");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Track Your Consignment</h1>
      <div className="flex gap-4">
        <input 
          className="border p-2 rounded" 
          value={id} 
          onChange={(e) => setId(e.target.value)} 
          placeholder="Enter Consignment ID" 
        />
        <button onClick={handleTrack} className="bg-blue-600 text-white p-2 rounded">Track</button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {data && (
        <div className="mt-10 grid grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-bold">Status: {data.status}</h2>
            <p>ETA: {new Date(data.estimatedDeliveryDate).toDateString()}</p>
            {data.predictedDelay > 0 && (
              <p className="text-amber-600 font-bold">
                ⚠️ Delayed by {data.predictedDelay} hours due to {data.weatherCondition}
              </p>
            )}
            
            <div className="mt-4 flex gap-4">
               <button onClick={generatePDF} className="bg-green-600 text-white p-2 rounded">
                 Generate Receipt (PDF)
               </button>
            </div>
          </div>
          
          <div className="h-64 bg-gray-200">
             {/* Pass coordinates to Leaflet component */}
             <MapComponent 
               lat={data.currentLocation.latitude} 
               long={data.currentLocation.longitude} 
             />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackParcel;