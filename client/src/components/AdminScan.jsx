import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Html5Qrcode } from "html5-qrcode"; // Library for file scanning
import { Scanner } from '@yudiel/react-qr-scanner'; // Library for live camera scanning

const AdminScan = () => {
  // Mode: 'create' = Register New, 'update' = Scan & Update Location
  const [mode, setMode] = useState('create'); 
  
  // Scanner State
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState('');

  // Form Data (For Creating New)
  const [formData, setFormData] = useState({
    consignmentId: '',
    senderName: '',
    senderPincode: '',
    recipientName: '',
    recipientPincode: '',
    weight: '',
    type: 'Normal Post'
  });

  // Update Data (For Existing)
  const [fetchedData, setFetchedData] = useState(null);
  const [newLocation, setNewLocation] = useState('');
  const [status, setStatus] = useState(null);

  // File Input Ref
  const fileInputRef = useRef(null);

  // --- LOGIC: HANDLE SCANNED CODE (From Camera or Image) ---
  const processScannedCode = async (decodedText) => {
    setScanResult(decodedText);
    setShowScanner(false);
    setStatus({ type: 'info', msg: `Scanned: ${decodedText}. Checking Database...` });

    try {
      // 1. Try to find the consignment in DB
      const res = await axios.get(`http://localhost:4000/api/consignment/track/${decodedText}`);
      
      // CASE A: FOUND -> Switch to Update Mode
      setMode('update');
      setFetchedData(res.data.data);
      setNewLocation(''); // Reset location input
      setStatus({ type: 'success', msg: 'Consignment Found! Update Location below.' });

    } catch (err) {
      // CASE B: NOT FOUND -> Switch to Register Mode
      console.log("Not found, switching to create mode");
      setMode('create');
      setFormData(prev => ({ ...prev, consignmentId: decodedText })); // Pre-fill ID
      setFetchedData(null);
      setStatus({ type: 'warning', msg: 'Consignment Not Found. Please Register details below.' });
    }
  };

  // --- HANDLER: UPLOAD IMAGE ---
  const handleFileUpload = async (e) => {
    if (e.target.files.length === 0) return;

    const imageFile = e.target.files[0];
    const html5QrCode = new Html5Qrcode("reader-hidden"); // Requires a hidden div ID

    try {
      setStatus({ type: 'info', msg: 'Processing Image...' });
      const decodedText = await html5QrCode.scanFile(imageFile, true);
      await processScannedCode(decodedText);
    } catch (err) {
      setStatus({ type: 'error', msg: 'Could not read barcode from image. Try clearer image.' });
    }
  };

  // --- HANDLER: UPDATE LOCATION ---
  const handleUpdateLocation = async () => {
    if (!newLocation || !scanResult) return;
    
    try {
      const res = await axios.post('http://localhost:4000/api/consignment/scan', {
        barcode: scanResult,
        scanLocation: {
          address: newLocation,
          latitude: 28.6139, 
          longitude: 77.2090
        }
      });

      if (res.data.success) {
        setStatus({ type: 'success', msg: 'Location Updated Successfully!' });
        setNewLocation('');
        // Refresh details
        const refresh = await axios.get(`http://localhost:4000/api/consignment/track/${scanResult}`);
        setFetchedData(refresh.data.data);
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Update Failed.' });
    }
  };

  // --- HANDLER: REGISTER NEW ---
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', msg: 'Processing...' });
    try {
      const payload = {
        consignmentId: formData.consignmentId,
        senderDetails: { name: formData.senderName, pincode: formData.senderPincode, address: "Source Hub" },
        recipientDetails: { name: formData.recipientName, pincode: formData.recipientPincode, address: "Dest Hub" },
        packageDetails: { weight: formData.weight, type: formData.type }
      };
      await axios.post('http://localhost:4000/api/consignment/create', payload);
      setStatus({ type: 'success', msg: 'Consignment Created!' });
      // Reset
      setFormData({ consignmentId: '', senderName: '', senderPincode: '', recipientName: '', recipientPincode: '', weight: '', type: 'Normal Post' });
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to create.' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      
      {/* Hidden Div for Image Processing */}
      <div id="reader-hidden" style={{ display: "none" }}></div>

      {/* Header & Tabs */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-red-700">Admin Operations</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setMode('create')}
            className={`px-4 py-2 rounded ${mode === 'create' ? 'bg-red-700 text-white' : 'bg-gray-200'}`}
          >
            Register New
          </button>
          <button 
            onClick={() => setMode('update')}
            className={`px-4 py-2 rounded ${mode === 'update' ? 'bg-red-700 text-white' : 'bg-gray-200'}`}
          >
            Update Location
          </button>
        </div>
      </div>

      {status && (
        <div className={`p-3 mb-4 rounded text-center font-bold ${
          status.type === 'success' ? 'bg-green-100 text-green-700' : 
          status.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
          status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {status.msg}
        </div>
      )}

      {/* --- SCANNING SECTION --- */}
      <div className="mb-6 flex flex-col items-center gap-4 border-b pb-6">
        <p className="text-gray-500 font-medium">Scan a Consignment to Auto-Detect Status</p>
        
        <div className="flex gap-4">
          {/* 1. Live Camera Button */}
          <button 
            onClick={() => setShowScanner(true)}
            className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-black transition flex items-center gap-2"
          >
             📷 Use Camera
          </button>

          {/* 2. Upload Image Button */}
          <button 
            onClick={() => fileInputRef.current.click()}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition flex items-center gap-2"
          >
             📁 Upload Image
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>

        {/* Live Scanner Display */}
        {showScanner && (
          <div className="w-64 h-64 bg-black relative overflow-hidden rounded-lg mt-4">
             <Scanner
                onScan={(result) => processScannedCode(result[0]?.rawValue)}
                onError={(error) => console.log(error)}
                components={{ audio: false }}
             />
             <button onClick={() => setShowScanner(false)} className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded z-10">Close</button>
          </div>
        )}
      </div>

      {/* --- MODE 1: UPDATE LOCATION (If Found) --- */}
      {mode === 'update' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <h3 className="font-bold text-lg mb-4 text-green-800 flex items-center gap-2">
              ✅ Package Found: {scanResult}
            </h3>
            
            {fetchedData ? (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <label className="block font-bold">Sender</label>
                    <div className="bg-white p-2 rounded border">{fetchedData.senderDetails?.name}</div>
                  </div>
                  <div>
                    <label className="block font-bold">Recipient</label>
                    <div className="bg-white p-2 rounded border">{fetchedData.recipientDetails?.name}</div>
                  </div>
                  <div>
                    <label className="block font-bold">Current Status</label>
                    <div className="bg-white p-2 rounded border">{fetchedData.status}</div>
                  </div>
                  <div>
                    <label className="block font-bold">Last Location</label>
                    <div className="bg-white p-2 rounded border">{fetchedData.currentLocation?.address}</div>
                  </div>
                </div>

                <div className="border-t pt-4 border-green-200">
                  <label className="block font-bold text-red-700 mb-2">📍 Set New Location</label>
                  <div className="flex gap-2">
                    <input 
                      className="flex-1 border-2 border-red-200 p-2 rounded focus:border-red-600 outline-none"
                      placeholder="e.g. Hyderabad Gateway Hub"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                    />
                    <button 
                      onClick={handleUpdateLocation}
                      className="bg-red-700 text-white px-6 py-2 rounded font-bold hover:bg-red-800"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p>Loading details...</p>
            )}
          </div>
        </div>
      )}

      {/* --- MODE 2: REGISTER NEW (If Not Found) --- */}
      {mode === 'create' && (
        <div className="animate-fade-in">
           <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded border border-yellow-200 text-sm">
             📝 <strong>Create Mode:</strong> Fill in the details below to register the new consignment.
           </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-gray-700">Consignment ID</label>
              <input 
                name="consignmentId" required
                value={formData.consignmentId} 
                onChange={(e) => setFormData({...formData, consignmentId: e.target.value})}
                className="w-full border-2 border-gray-300 p-2 rounded focus:border-red-500 outline-none font-mono font-bold"
                placeholder="Scan or Type ID"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Sender Name" name="senderName" value={formData.senderName} onChange={(e) => setFormData({...formData, senderName: e.target.value})} className="border p-2 rounded" />
              <input placeholder="Sender Pincode" name="senderPincode" value={formData.senderPincode} onChange={(e) => setFormData({...formData, senderPincode: e.target.value})} className="border p-2 rounded" />
              <input placeholder="Recipient Name" name="recipientName" value={formData.recipientName} onChange={(e) => setFormData({...formData, recipientName: e.target.value})} className="border p-2 rounded" />
              <input placeholder="Recipient Pincode" name="recipientPincode" value={formData.recipientPincode} onChange={(e) => setFormData({...formData, recipientPincode: e.target.value})} className="border p-2 rounded" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <input type="number" placeholder="Weight (kg)" name="weight" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="border p-2 rounded" />
               <select name="type" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="border p-2 rounded">
                  <option>Normal Post</option>
                  <option>Speed Post</option>
               </select>
            </div>

            <button type="submit" className="w-full bg-red-700 text-white font-bold py-3 rounded hover:bg-red-800 transition shadow-lg">
              Register Consignment
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default AdminScan;