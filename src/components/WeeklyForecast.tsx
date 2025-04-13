
import React from "react";
import { useWeather } from "@/context/WeatherContext";
import { Sunrise, Sunset } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const WeeklyForecast: React.FC = () => {
  const { forecastData, weatherData, isCelsius } = useWeather();

  if (!forecastData || !weatherData) {
    return (
      <div className="mt-4 sm:mt-6 bg-card-bg rounded-3xl p-5 w-full animate-pulse flex items-center justify-center h-[30vh]">
        <p className="text-text-secondary">Loading forecast data...</p>
      </div>
    );
  }

  // Process forecast data to get daily forecasts (6 days excluding today)
  const dailyForecasts: Record<string, any> = {};
  const today = new Date().toLocaleDateString();
  
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    
    // Skip today's forecast
    if (date === today) return;
    
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        date,
        icon: item.weather[0].icon,
        description: item.weather[0].description,
        temp_max: item.main.temp_max,
        temp_min: item.main.temp_min
      };
    } else {
      dailyForecasts[date].temp_max = Math.max(dailyForecasts[date].temp_max, item.main.temp_max);
      dailyForecasts[date].temp_min = Math.min(dailyForecasts[date].temp_min, item.main.temp_min);
    }
  });

  // Convert temperature based on the selected unit
  const convertTemp = (temp: number): number => {
    return isCelsius ? temp : (temp * 9/5) + 32;
  };

  // Format time
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    
    hours = hours % 12 || 12;
    
    return `${hours}:${minutes} ${ampm}`;
  };

  // Calculate day length
  const dayLengthMs = (weatherData.sys.sunset - weatherData.sys.sunrise) * 1000;
  const hours = Math.floor(dayLengthMs / (1000 * 60 * 60));
  const minutes = Math.floor((dayLengthMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="mt-4 sm:mt-6 bg-card-bg rounded-3xl p-3 sm:p-5 w-full animate-fade-in">
      <h2 className="text-lg font-semibold">Week Forecast</h2>
      
      <ScrollArea className="w-full pb-2 hide-scrollbar">
        <div className="flex gap-2 mt-4 min-w-full">
          {Object.values(dailyForecasts).slice(0, 6).map((forecast, index) => (
            <div 
              key={index} 
              className="min-w-[100px] h-[130px] sm:min-w-[110px] bg-tertiary p-3 rounded-xl flex flex-col items-center justify-between"
            >
              <p className="text-xs sm:text-sm">{new Date(forecast.date).toLocaleDateString("en-US", { weekday: "short" })}</p>
              <img 
                src={`http://openweathermap.org/img/wn/${forecast.icon}.png`} 
                alt={forecast.description}
                className="w-10 h-10"
              />
              <div className="text-xs sm:text-sm">
                <span className="font-bold">{Math.round(convertTemp(forecast.temp_max))}</span>
                <span className="text-text-secondary mx-1">/</span>
                <span className="text-text-secondary">{Math.round(convertTemp(forecast.temp_min))}</span>
                <span>{isCelsius ? "°C" : "°F"}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="mt-4 bg-tertiary p-3 sm:p-4 rounded-lg">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <Sunrise size={16} className="text-yellow-400 sm:size-20" />
            <div>
              <p className="text-[10px] sm:text-sm text-text-secondary">Sunrise</p>
              <p className="text-xs sm:text-xl font-bold">{formatTime(weatherData.sys.sunrise)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <Sunset size={16} className="text-orange-400 sm:size-20" />
            <div>
              <p className="text-[10px] sm:text-sm text-text-secondary">Sunset</p>
              <p className="text-xs sm:text-xl font-bold">{formatTime(weatherData.sys.sunset)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <div>
              <p className="text-[10px] sm:text-sm text-text-secondary">Length of day</p>
              <p className="text-xs sm:text-xl font-bold">{hours}h {minutes}min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyForecast;
