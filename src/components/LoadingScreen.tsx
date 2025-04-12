
import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-app-bg">
      <div className="text-brand text-4xl font-bold mb-4">Freshcast</div>
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-brand rounded-full opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-brand rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-white">Loading weather data...</p>
    </div>
  );
};

export default LoadingScreen;
