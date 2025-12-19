import React from 'react';
import { FaCheck, FaTruck, FaBox, FaClipboardCheck, FaHome } from 'react-icons/fa';

// 1. Add 'trackingId' to the received props
const StatusTimeline = ({ status, trackingId }) => {
  
  const steps = [
    { id: 1, label: "Booked", icon: FaClipboardCheck },
    { id: 2, label: "Dispatched", icon: FaBox },
    { id: 3, label: "In Transit", icon: FaTruck },
    { id: 4, label: "Out for Delivery", icon: FaTruck },
    { id: 5, label: "Delivered", icon: FaHome },
  ];

  const getStepState = (stepIndex) => {
    const statusMap = { "Booked": 0, "Dispatched": 1, "In Transit": 2, "Out for Delivery": 3, "Delivered": 4 };
    const currentIndex = statusMap[status] || 2;
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 animate-fade-in-up">
      
      <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-4">
        <div>
           {/* 2. Use the dynamic 'trackingId' here */}
           <h3 className="text-xl font-bold text-gray-800">
             Consignment No: <span className="text-red-700">{trackingId || "UNKNOWN"}</span>
           </h3>
           <p className="text-sm text-gray-500 mt-1">Expected Delivery: <span className="text-gray-800 font-medium">24 Dec, 2025</span></p>
        </div>
        <button className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition">
          Print Receipt
        </button>
      </div>

      {/* ... (Keep the rest of the Timeline code exactly the same) ... */}
      
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full z-0 transition-all duration-1000 ease-out" style={{ width: '50%' }}></div>

        <div className="relative z-10 flex justify-between w-full">
          {steps.map((step, index) => {
            const state = getStepState(index);
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center group">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg shadow-md transition-all duration-300 ${state === 'completed' ? 'bg-green-500 scale-100' : ''} ${state === 'current' ? 'bg-red-600 scale-110 ring-4 ring-red-100' : ''} ${state === 'pending' ? 'bg-gray-300' : ''}`}>
                  {state === 'completed' ? <FaCheck /> : <Icon />}
                </div>
                <p className={`mt-4 text-sm font-medium transition-colors duration-300 ${state === 'completed' ? 'text-green-600' : ''} ${state === 'current' ? 'text-red-700 font-bold' : ''} ${state === 'pending' ? 'text-gray-400' : ''}`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg flex items-start space-x-3">
        <div className="text-blue-500 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
        </div>
        <div>
            <h4 className="font-bold text-blue-900 text-sm">AI Insight</h4>
            <p className="text-blue-700 text-sm mt-1">
                Package is currently delayed by <span className="font-bold">2 hours</span> due to heavy rain in Mumbai region.
            </p>
        </div>
      </div>

    </div>
  );
};

export default StatusTimeline;