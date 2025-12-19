import React, { useState } from "react";
import axios from 'axios';
import { FaSearch, FaBoxOpen } from "react-icons/fa";
import StatusTimeline from "./StatusTimeline"; // <--- Import the new component

const Tracking = () => {
  const [trackingId, setTrackingId] = useState("");
  const [parcelData, setParcelData] = useState(null); // Store real data
  const [loading, setLoading] = useState(false);
//   const [showResult, setShowResult] = useState(false); // <--- State to control visibility

  const handleTrack = async () => {
    if (!trackingId) return alert("Please enter a tracking ID");

    setLoading(true);
    setParcelData(null);

    try {
        const res = await axios.post('http://localhost:5000/api/track', { trackingId });
        setParcelData(res.data.data); // Save the data from backend
    } catch (error) {
        alert("Parcel Not Found or Server Error");
    } finally {
        setLoading(false);
    }
    
    // // Simulate API Loading
    // setShowResult(false);
    // setTimeout(() => {
    //   setShowResult(true);
    //   // Scroll to the result
    //   const element = document.getElementById("results-section");
    //   if (element) element.scrollIntoView({ behavior: "smooth" });
    // }, 800);
  };

  return (
    <div className="w-full animate-fade-in-up pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-red-50 to-white py-24 px-4 text-center">
        <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-8">
          <FaBoxOpen />
          <span>AI-Powered Logistics</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Track Smarter,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
            Deliver Faster
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          The next generation of India Post. Experience weather-based delay
          predictions and real-time analytics.
        </p>

        {/* Search Input */}
        <div className="max-w-3xl mx-auto relative group z-20">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400 text-xl" />
          </div>
          <input
            type="text"
            placeholder="Enter Consignment Number (e.g., EN590687155IN)"
            className="w-full pl-16 pr-40 py-6 rounded-full border-2 border-gray-100 shadow-2xl text-lg focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleTrack()}
          />
          <button
            onClick={handleTrack}
            className="absolute right-2.5 top-2.5 bottom-2.5 bg-red-600 hover:bg-red-700 text-white font-bold px-8 rounded-full transition-all shadow-lg hover:shadow-red-500/30"
          >
            {loading ? "Scanning..." : "Track Now"}
          </button>
        </div>

        {/* Quick Links */}
        <div id="results-section" className="container mx-auto px-4">
          {showResult && (
            // Pass the trackingId state here
            <StatusTimeline status="In Transit" trackingId={trackingId} />
          )}
        </div>
      </div>

      {/* RESULT SECTION (Injects here) */}
      <div id="results-section" className="container mx-auto px-4">
        {showResult && <StatusTimeline status="In Transit" />}
      </div>
    </div>
  );
};

export default Tracking;
