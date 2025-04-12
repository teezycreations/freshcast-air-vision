
import React from "react";
import { useWeather } from "@/context/WeatherContext";
import { 
  Home, 
  PieChart, 
  MapPin, 
  Calendar, 
  Settings,
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Sidebar: React.FC = () => {
  const { isDarkMode, toggleDarkMode, openMapView, openForecastView, openAnalyticsView } = useWeather();
  
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

          <a className="cursor-pointer group" onClick={openAnalyticsView}>
            <PieChart 
              size={24} 
              className="text-text-secondary group-hover:text-brand transition-colors" 
            />
          </a>

          <a className="cursor-pointer group" onClick={openMapView}>
            <MapPin 
              size={24} 
              className="text-text-secondary group-hover:text-brand transition-colors" 
            />
          </a>

          <a className="cursor-pointer group" onClick={openForecastView}>
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
        
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex items-center gap-2">
            <Moon className="text-text-secondary h-4 w-4" />
            <Switch 
              checked={!isDarkMode}
              onCheckedChange={toggleDarkMode}
              className="data-[state=checked]:bg-brand"
            />
            <Sun className="text-text-secondary h-4 w-4" />
          </div>
          <span className="text-xs text-text-secondary">Theme</span>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
