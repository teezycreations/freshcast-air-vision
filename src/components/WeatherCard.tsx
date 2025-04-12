
import React from "react";
import { useWeather } from "@/context/WeatherContext";
import { formatDate, formatTime, calculateDayLength, convertTemperature } from "@/utils/helpers";
import { Switch } from "@/components/ui/switch";

const WeatherCard: React.FC = () => {
  const { weatherData, forecastData, isCelsius, toggleUnit } = useWeather();

  if (!weatherData) {
    return (
      <div className="bg-gradient-to-r from-tertiary to-card-bg rounded-3xl p-5 h-[250px] sm:h-[300px] lg:h-[350px] animate-pulse flex items-center justify-center">
        <p className="text-text-secondary">Loading weather data...</p>
      </div>
    );
  }

  const date = new Date();
  const dayLength = weatherData?.sys 
    ? calculateDayLength(weatherData.sys.sunrise, weatherData.sys.sunset) 
    : { hours: 0, minutes: 0 };

  // Calculate temperature values with proper conversion
  const temp = Math.round(convertTemperature(weatherData.main.temp, isCelsius));
  const feelsLike = Math.round(convertTemperature(weatherData.main.feels_like, isCelsius));
  const highTemp = forecastData 
    ? Math.max(...forecastData.list.slice(0, 8).map(item => item.main.temp_max))
    : weatherData.main.temp_max;
  const lowTemp = forecastData 
    ? Math.min(...forecastData.list.slice(0, 8).map(item => item.main.temp_min))
    : weatherData.main.temp_min;
  
  const highTempDisplay = Math.round(convertTemperature(highTemp, isCelsius));
  const lowTempDisplay = Math.round(convertTemperature(lowTemp, isCelsius));

  return (
    <div className="bg-gradient-to-r from-tertiary to-card-bg rounded-3xl p-3 sm:p-5 h-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div className="flex flex-col h-full justify-between">
          <div className="inline-flex gap-2 bg-brand rounded-3xl py-1 px-3 sm:py-2 sm:px-5 items-center">
            <svg width="14" height="14" viewBox="0 0 34 41" className="text-white" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M17.125 9.28125C15.4162 9.28125 14.0312 10.6662 14.0312 12.375C14.0312 14.0838 15.4162 15.4687 17.125 15.4687C18.8338 15.4687 20.2187 14.0838 20.2187 12.375C20.2187 10.6662 18.8338 9.28125 17.125 9.28125ZM17.125 17.5312C14.2777 17.5312 11.9687 15.2233 11.9687 12.375C11.9687 9.52668 14.2777 7.21875 17.125 7.21875C19.9723 7.21875 22.2812 9.52668 22.2812 12.375C22.2812 15.2233 19.9723 17.5312 17.125 17.5312ZM17.125 0C10.2909 0 4.75 5.5409 4.75 12.375C4.75 17.5498 15.0677 33.0113 17.125 33C19.1504 33.0113 29.5 17.4797 29.5 12.375C29.5 5.5409 23.9591 0 17.125 0Z" />
            </svg>
            <h3 className="city text-xs sm:text-sm">{weatherData.name}, {weatherData.sys.country}</h3>
          </div>

          <div className="mt-3 sm:mt-4">
            <h1 className="text-xl sm:text-3xl font-semibold">{formatDate(date).split(',')[0]}</h1>
            <h2 className="text-xs sm:text-sm text-text-secondary">{formatDate(date).split(',').slice(1).join(',').trim()}</h2>
          </div>

          <div className="mt-2 sm:mt-3">
            <div className="flex items-end">
              <h1 className="text-3xl sm:text-5xl font-bold">{temp}°</h1>
              <span className="text-lg sm:text-xl mb-1">{isCelsius ? 'C' : 'F'}</span>
            </div>
            <div className="flex gap-2 text-xs sm:text-sm">
              <p>High: {highTempDisplay}°{isCelsius ? 'C' : 'F'}</p>
              <p>|</p>
              <p>Low: {lowTempDisplay}°{isCelsius ? 'C' : 'F'}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end mt-4 sm:mt-0">
          <div className="flex items-center gap-2">
            <span className="text-xs">°C</span>
            <Switch 
              checked={!isCelsius} 
              onCheckedChange={toggleUnit}
              className="data-[state=checked]:bg-brand"
            />
            <span className="text-xs">°F</span>
          </div>

          <img 
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
            alt={weatherData.weather[0].description}
            className="w-24 h-24 sm:w-32 sm:h-32 mt-2"
          />

          <div className="text-right mt-2">
            <h3 className="text-lg sm:text-xl font-semibold capitalize">{weatherData.weather[0].description}</h3>
            <p className="text-xs sm:text-sm text-text-secondary">Feels like {feelsLike}°{isCelsius ? 'C' : 'F'}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-tertiary/30 p-2 sm:p-3 rounded-lg">
          <p className="text-[10px] sm:text-xs text-text-secondary">Sunrise</p>
          <p className="text-sm sm:text-lg font-semibold">{formatTime(weatherData.sys.sunrise)}</p>
        </div>
        <div className="bg-tertiary/30 p-2 sm:p-3 rounded-lg">
          <p className="text-[10px] sm:text-xs text-text-secondary">Sunset</p>
          <p className="text-sm sm:text-lg font-semibold">{formatTime(weatherData.sys.sunset)}</p>
        </div>
        <div className="bg-tertiary/30 p-2 sm:p-3 rounded-lg">
          <p className="text-[10px] sm:text-xs text-text-secondary">Day Length</p>
          <p className="text-sm sm:text-lg font-semibold">{dayLength.hours}h {dayLength.minutes}min</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
