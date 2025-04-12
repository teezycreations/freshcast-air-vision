
import React, { useEffect, useRef } from "react";
import { useWeather } from "@/context/WeatherContext";

const AQICard: React.FC = () => {
  const { airQualityData } = useWeather();
  const indicatorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (airQualityData && indicatorRef.current) {
      const aqi = airQualityData.list[0].main.aqi;
      // AQI ranges from 1 (Good) to 5 (Very Poor)
      // Convert it to a rotation between -70 and 70 degrees
      const rotation = ((aqi - 1) / 4) * 140 - 70;
      indicatorRef.current.style.transform = `rotate(${rotation}deg)`;
    }
  }, [airQualityData]);

  if (!airQualityData) {
    return (
      <div className="bg-gradient-to-r from-tertiary to-card-bg rounded-3xl p-5 h-[44vh] w-full animate-pulse flex items-center justify-center">
        <p className="text-text-secondary">Loading air quality data...</p>
      </div>
    );
  }

  const aqi = airQualityData.list[0].main.aqi;
  const aqiLabels = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"];
  const aqiColors = ["", "#00E400", "#FFFF00", "#FF7E00", "#FF0000", "#8F3F97"];

  return (
    <div className="bg-gradient-radial from-[#162850] to-[#121A2D] rounded-3xl p-5 h-[44vh] w-full animate-fade-in">
      <h2 className="text-xl font-semibold mb-2">Air Quality Index</h2>
      <p className="text-sm text-text-secondary mb-4">Current air quality in the area</p>
      
      <div id="speedometer" className="h-[calc(100%-4rem)]">
        <div className="wrapper relative">
          <div className="indicator-wrapper">
            <div className="indicator-wrapper-inner">
              <div id="indicator" ref={indicatorRef}></div>
              <div className="aqi-value text-white font-semibold">
                <span style={{ color: aqiColors[aqi] }}>
                  AQI: {aqi} - {aqiLabels[aqi]}
                </span>
              </div>
            </div>
          </div>
          <div className="bar bar-1"></div>
          <div className="bar bar-2"></div>
          <div className="bar bar-3"></div>
          <div className="bar bar-4"></div>
          
          <div className="absolute bottom-2 left-0 w-full flex justify-between px-8 text-xs text-text-secondary">
            <span>Good</span>
            <span>Moderate</span>
            <span>Poor</span>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-tertiary/30 p-3 rounded-lg">
            <p className="text-xs text-text-secondary">PM2.5</p>
            <p className="text-lg font-semibold">{airQualityData.list[0].components.pm2_5.toFixed(1)} µg/m³</p>
          </div>
          <div className="bg-tertiary/30 p-3 rounded-lg">
            <p className="text-xs text-text-secondary">PM10</p>
            <p className="text-lg font-semibold">{airQualityData.list[0].components.pm10.toFixed(1)} µg/m³</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AQICard;
