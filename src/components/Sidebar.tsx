
import React from "react";
import { useWeather } from "@/context/WeatherContext";
import { 
  Home, 
  PieChart, 
  MapPin, 
  Calendar, 
  Settings,
  LogOut
} from "lucide-react";

const Sidebar: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useWeather();
  
  return (
    <nav className="flex flex-col justify-between p-5 items-center rounded-3xl mt-5 h-[95vh] bg-card-bg w-20 lg:w-24 animate-fade-in">
      <div className="flex flex-col items-center gap-10">
        <div className="flex items-center justify-center flex-col gap-2">
          <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">FC</span>
          </div>
          <h2 className="text-sm tracking-tighter">Freshcast</h2>
        </div>

        <div className="flex flex-col gap-10 items-center">
          <a className="cursor-pointer group">
            <Home 
              size={24} 
              className="text-text-secondary group-hover:text-brand transition-colors" 
            />
          </a>

          <a className="cursor-pointer group">
            <PieChart 
              size={24} 
              className="text-text-secondary group-hover:text-brand transition-colors" 
            />
          </a>

          <a className="cursor-pointer group">
            <MapPin 
              size={24} 
              className="text-text-secondary group-hover:text-brand transition-colors" 
            />
          </a>

          <a className="cursor-pointer group">
            <Calendar 
              size={24} 
              className="text-text-secondary group-hover:text-brand transition-colors" 
            />
          </a>

          <a className="cursor-pointer group">
            <Settings 
              size={24} 
              className="text-text-secondary group-hover:text-brand transition-colors" 
            />
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-8 items-center">
        <a className="cursor-pointer"> 
          <LogOut size={24} className="text-text-secondary hover:text-brand transition-colors" /> 
        </a>
        
        <div>
          <input 
            type="checkbox" 
            className="checkbox" 
            id="checkbox" 
            checked={!isDarkMode}
            onChange={toggleDarkMode}
          />
          <label htmlFor="checkbox" className="checkbox-label">
            <span className="text-sm">🌙</span>
            <span className="text-sm">☀️</span>
            <span className="ball"></span>
          </label>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
