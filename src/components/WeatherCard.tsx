
import React from "react";
import { useWeather } from "@/context/WeatherContext";
import { MapPin } from "lucide-react";

const WeatherCard: React.FC = () => {
  const { weatherData, isCelsius, toggleUnit } = useWeather();

  if (!weatherData) {
    return (
      <div className="bg-card-bg rounded-3xl h-[41vh] w-full animate-pulse flex items-center justify-center">
        <p className="text-text-secondary">Loading weather data...</p>
      </div>
    );
  }

  // Format date and time
  const now = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = dayNames[now.getDay()];
  const date = now.getDate();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();

  // Convert temperature based on the selected unit
  const convertTemp = (temp: number): number => {
    return isCelsius ? temp : (temp * 9/5) + 32;
  };

  const temp = Math.round(convertTemp(weatherData.main.temp));
  const highTemp = Math.round(convertTemp(weatherData.main.temp_max));
  const lowTemp = Math.round(convertTemp(weatherData.main.temp_min));
  const feelsLike = Math.round(convertTemp(weatherData.main.feels_like));
  const unit = isCelsius ? "°C" : "°F";

  return (
    <div className="bg-card-bg rounded-3xl h-[41vh] w-full p-7 animate-fade-in">
      <div className="flex justify-between h-full">
        <div className="flex flex-col justify-between">
          <div className="inline-flex gap-2 items-center rounded-3xl bg-brand py-2 px-4">
            <MapPin size={18} className="text-white" />
            <h3 className="font-medium">{weatherData.name}, {weatherData.sys.country}</h3>
          </div>

          <div className="mt-4">
            <h1 className="text-4xl font-bold">{day}</h1>
            <h2 className="text-text-secondary">{date} {month}, {year}</h2>
          </div>

          <div className="mt-4">
            <h1 className="text-5xl font-bold">{temp}{unit}</h1>
            <div className="flex gap-2 text-text-secondary">
              <p>High: {highTemp}{unit}</p>
              <p>|</p>
              <p>Low: {lowTemp}{unit}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="unit-toggle-container">
            <input 
              type="checkbox" 
              className="unit-toggle-checkbox" 
              id="unitToggle" 
              checked={!isCelsius}
              onChange={toggleUnit}
            />
            <label htmlFor="unitToggle" className="unit-toggle-label">
              <span className="unit-celsius">°C</span>
              <span className="unit-fahrenheit">°F</span>
              <span className="unit-ball"></span>
            </label>
          </div>

          <img 
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
            alt={weatherData.weather[0].description}
            className="w-32 mt-4"
          />
          
          <div className="mt-4 flex flex-col items-end">
            <h3 className="text-2xl font-medium capitalize">{weatherData.weather[0].description}</h3>
            <p className="text-sm text-text-secondary">Feels like {feelsLike}{unit}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
