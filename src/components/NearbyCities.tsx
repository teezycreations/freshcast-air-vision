
import React from "react";
import { useWeather } from "@/context/WeatherContext";
import { MapPin } from "lucide-react";

const NearbyCities: React.FC = () => {
  const { nearbyCities, isCelsius, searchCity } = useWeather();

  // Ensure we're safely checking if nearbyCities is available and has length
  const hasNearbyCities = Array.isArray(nearbyCities) && nearbyCities.length > 0;

  if (!hasNearbyCities) {
    return (
      <div className="mt-6 animate-pulse">
        <h2 className="tracking-tighter font-medium text-2xl mb-3">Other Cities</h2>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-card-bg h-36 rounded-3xl flex items-center justify-center">
              <p className="text-text-secondary">Loading...</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Convert temperature based on the selected unit
  const convertTemp = (temp: number): number => {
    return isCelsius ? temp : (temp * 9/5) + 32;
  };

  const handleCityClick = (cityName: string) => {
    searchCity(cityName);
  };

  return (
    <div className="mt-6 animate-fade-in">
      <h2 className="tracking-tighter font-medium text-2xl mb-3">Other Cities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {nearbyCities.slice(0, 4).map((city, index) => (
          <div 
            key={index} 
            className="bg-card-bg rounded-3xl p-4 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleCityClick(city.name)}
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-sm text-text-secondary mb-1">
                <MapPin size={14} />
                <h3>{city.name}, {city.sys?.country || ""}</h3>
              </div>
              
              <img 
                src={`http://openweathermap.org/img/wn/${city.weather[0].icon}.png`} 
                alt={city.weather[0].description}
                className="w-12 h-12"
              />
              
              <p className="text-2xl font-bold">
                {Math.round(convertTemp(city.main.temp))}{isCelsius ? "°C" : "°F"}
              </p>
              
              <p className="text-sm text-text-secondary capitalize">
                {city.weather[0].description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyCities;
