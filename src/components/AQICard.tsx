
import React, { useEffect, useRef } from "react";
import { useWeather } from "@/context/WeatherContext";
import { Progress } from "@/components/ui/progress";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const AQICard: React.FC = () => {
  const { airQualityData } = useWeather();
  const gaugeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (airQualityData && gaugeRef.current) {
      const aqi = airQualityData.list[0].main.aqi;
      // AQI ranges from 1 (Good) to 5 (Very Poor)
      // Calculate rotation and position pointer
      const rotation = ((aqi - 1) / 4) * 140 - 70;
      const gauge = gaugeRef.current.querySelector('.gauge-pointer') as HTMLElement;
      if (gauge) {
        gauge.style.transform = `rotate(${rotation}deg)`;
      }
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
  
  // Create data for the small charts
  const pollutantData = [
    { name: 'PM2.5', value: airQualityData.list[0].components.pm2_5 },
    { name: 'PM10', value: airQualityData.list[0].components.pm10 },
    { name: 'O3', value: airQualityData.list[0].components.o3 },
    { name: 'NO2', value: airQualityData.list[0].components.no2 }
  ];
  
  // Calculate AQI percentage for progress bar (1-5 scale to 0-100%)
  const aqiPercentage = ((aqi - 1) / 4) * 100;

  return (
    <div className="bg-gradient-radial from-[#162850] to-[#121A2D] rounded-3xl p-5 h-[44vh] w-full animate-fade-in">
      <h2 className="text-xl font-semibold mb-2">Air Quality Index</h2>
      <p className="text-sm text-text-secondary mb-4">Current air quality in the area</p>
      
      <div ref={gaugeRef} className="gauge-container relative mb-8 mt-4">
        {/* Semi-circular gauge */}
        <div className="gauge-bg h-[120px] w-full relative">
          {/* Gauge colored segments */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-600 rounded-t-full"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-card-bg rounded-t-full scale-90 origin-bottom"></div>
          </div>
          
          {/* Gauge pointer */}
          <div className="gauge-pointer absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-[95px] bg-white origin-bottom transition-transform duration-1000"></div>
          
          {/* AQI value display */}
          <div className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-3xl font-bold" style={{ color: aqiColors[aqi] }}>{aqi}</div>
            <div className="text-sm font-medium">{aqiLabels[aqi]}</div>
          </div>
          
          {/* Gauge labels */}
          <div className="absolute bottom-0 w-full flex justify-between px-4 text-xs text-text-secondary">
            <span>Good</span>
            <span className="ml-auto">Poor</span>
          </div>
        </div>
        
        {/* Linear progress representation as an alternative visual */}
        <Progress value={aqiPercentage} className="h-2 mt-2" 
          style={{
            background: 'linear-gradient(to right, #00E400, #FFFF00, #FF7E00, #FF0000)',
          }}
        />
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
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
  );
};

export default AQICard;
