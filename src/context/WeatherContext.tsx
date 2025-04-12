import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/use-toast";
import { 
  fetchWeatherByLocation, 
  fetchWeatherByCity, 
  fetchForecast, 
  fetchAirQuality, 
  fetchNearbyCities,
  WeatherData,
  ForecastData,
  AirQualityData
} from "@/services/weatherService";

interface IWeatherContext {
  weatherData: WeatherData | null;
  forecastData: ForecastData | null;
  airQualityData: AirQualityData | null;
  nearbyCities: WeatherData[];
  nearbyCitiesData: WeatherData[] | null;
  loading: boolean;
  searchCity: (city: string) => void;
  isCelsius: boolean;
  toggleUnit: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  openMapView: () => void;
  openForecastView: () => void;
  openAnalyticsView: () => void;
}

const WeatherContext = createContext<IWeatherContext | undefined>(undefined);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};

interface WeatherProviderProps {
  children: ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [nearbyCitiesData, setNearbyCitiesData] = useState<WeatherData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchAllWeatherData(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError("Failed to get your location. Please search for a city.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Please search for a city.");
      setLoading(false);
    }
  }, []);

  const fetchAllWeatherData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const [weather, forecast, airQuality, nearby] = await Promise.all([
        fetchWeatherByLocation(lat, lon),
        fetchForecast(lat, lon),
        fetchAirQuality(lat, lon),
        fetchNearbyCities(lat, lon)
      ]);
      
      setWeatherData(weather);
      setForecastData(forecast);
      setAirQualityData(airQuality);
      setNearbyCitiesData(nearby);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Failed to fetch weather data. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchCity = async (city: string) => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const weatherData = await fetchWeatherByCity(city);
      const { lat, lon } = weatherData.coord;
      
      await fetchAllWeatherData(lat, lon);
    } catch (error) {
      console.error("Error searching city:", error);
      setError("City not found. Please try another city.");
      toast({
        title: "City Not Found",
        description: "Please try another city name.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const toggleUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  const openMapView = () => {
    if (weatherData) {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm';
      modal.innerHTML = `
        <div class="bg-card-bg rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div class="flex justify-between items-center p-4 border-b border-tertiary">
            <h2 class="text-xl font-semibold">Location: ${weatherData.name}, ${weatherData.sys.country}</h2>
            <button class="close-modal text-text-secondary hover:text-white">&times;</button>
          </div>
          <div class="p-4">
            <div class="aspect-video w-full rounded-lg overflow-hidden">
              <iframe 
                width="100%" 
                height="100%" 
                frameborder="0" 
                style="border:0" 
                src="https://www.openstreetmap.org/export/embed.html?bbox=${weatherData.coord.lon-0.1}%2C${weatherData.coord.lat-0.1}%2C${weatherData.coord.lon+0.1}%2C${weatherData.coord.lat+0.1}&amp;layer=mapnik&amp;marker=${weatherData.coord.lat}%2C${weatherData.coord.lon}" 
                allowfullscreen>
              </iframe>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div class="bg-tertiary/30 p-4 rounded-lg">
                <h3 class="text-sm text-text-secondary">Coordinates</h3>
                <p class="text-lg">Lat: ${weatherData.coord.lat.toFixed(2)} | Lon: ${weatherData.coord.lon.toFixed(2)}</p>
              </div>
              <div class="bg-tertiary/30 p-4 rounded-lg">
                <h3 class="text-sm text-text-secondary">Wind</h3>
                <p class="text-lg">${weatherData.wind.speed} m/s | ${weatherData.wind.deg}°</p>
              </div>
              <div class="bg-tertiary/30 p-4 rounded-lg">
                <h3 class="text-sm text-text-secondary">Pressure</h3>
                <p class="text-lg">${weatherData.main.pressure} hPa</p>
              </div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      const closeButton = modal.querySelector('.close-modal');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          modal.remove();
        });
      }
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    }
  };

  const openForecastView = () => {
    if (forecastData) {
      const dailyForecasts: { [key: string]: any[] } = {};
      
      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        
        if (!dailyForecasts[day]) {
          dailyForecasts[day] = [];
        }
        
        dailyForecasts[day].push(item);
      });
      
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm';
      
      let forecastHTML = '';
      
      for (const [day, forecasts] of Object.entries(dailyForecasts)) {
        const temps = forecasts.map(f => f.main.temp);
        const minTemp = Math.round(Math.min(...temps));
        const maxTemp = Math.round(Math.max(...temps));
        const icon = forecasts[0].weather[0].icon;
        
        let hourlyHTML = '';
        forecasts.forEach(item => {
          const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          hourlyHTML += `
            <div class="text-center p-2">
              <p class="text-sm text-text-secondary">${time}</p>
              <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" class="mx-auto w-8 h-8" alt="${item.weather[0].description}">
              <p class="text-sm font-semibold">${Math.round(item.main.temp)}°${isCelsius ? 'C' : 'F'}</p>
              <p class="text-xs text-text-secondary">${item.weather[0].description}</p>
            </div>
          `;
        });
        
        forecastHTML += `
          <div class="bg-tertiary/20 rounded-lg p-4 mb-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">${day}</h3>
              <div class="flex items-center gap-2">
                <span class="text-sm">${minTemp}°${isCelsius ? 'C' : 'F'}</span>
                <div class="w-20 h-1 bg-tertiary/50 rounded-full">
                  <div class="h-full bg-brand rounded-full" style="width: 70%"></div>
                </div>
                <span class="text-sm">${maxTemp}°${isCelsius ? 'C' : 'F'}</span>
              </div>
            </div>
            <div class="overflow-x-auto">
              <div class="flex gap-4 min-w-max">
                ${hourlyHTML}
              </div>
            </div>
          </div>
        `;
      }
      
      modal.innerHTML = `
        <div class="bg-card-bg rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div class="flex justify-between items-center p-4 border-b border-tertiary">
            <h2 class="text-xl font-semibold">5-Day Forecast: ${forecastData.city.name}, ${forecastData.city.country}</h2>
            <button class="close-modal text-text-secondary hover:text-white">&times;</button>
          </div>
          <div class="p-4 overflow-y-auto max-h-[calc(90vh-4rem)]">
            ${forecastHTML}
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      const closeButton = modal.querySelector('.close-modal');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          modal.remove();
        });
      }
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    }
  };

  const openAnalyticsView = () => {
    if (weatherData && forecastData) {
      const tempData = forecastData.list.slice(0, 8).map(item => {
        const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit' });
        return {
          time,
          temp: Math.round(item.main.temp),
          feels_like: Math.round(item.main.feels_like),
        };
      });
      
      const humidityData = forecastData.list.slice(0, 8).map(item => {
        const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit' });
        return {
          time,
          humidity: item.main.humidity,
        };
      });
      
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm';
      
      modal.innerHTML = `
        <div class="bg-card-bg rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div class="flex justify-between items-center p-4 border-b border-tertiary">
            <h2 class="text-xl font-semibold">Weather Analytics: ${weatherData.name}, ${weatherData.sys.country}</h2>
            <button class="close-modal text-text-secondary hover:text-white">&times;</button>
          </div>
          <div class="p-4 overflow-y-auto max-h-[calc(90vh-4rem)]">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-tertiary/20 rounded-lg p-4">
                <h3 class="text-lg font-semibold mb-4">Temperature Overview</h3>
                <div class="mb-4">
                  <p class="text-xs text-text-secondary">Current</p>
                  <p class="text-5xl font-bold">${Math.round(weatherData.main.temp)}°${isCelsius ? 'C' : 'F'}</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs text-text-secondary">Feels Like</p>
                    <p class="text-xl font-semibold">${Math.round(weatherData.main.feels_like)}°${isCelsius ? 'C' : 'F'}</p>
                  </div>
                  <div>
                    <p class="text-xs text-text-secondary">Humidity</p>
                    <p class="text-xl font-semibold">${weatherData.main.humidity}%</p>
                  </div>
                  <div>
                    <p class="text-xs text-text-secondary">Min Temp</p>
                    <p class="text-xl font-semibold">${Math.round(weatherData.main.temp_min)}°${isCelsius ? 'C' : 'F'}</p>
                  </div>
                  <div>
                    <p class="text-xs text-text-secondary">Max Temp</p>
                    <p class="text-xl font-semibold">${Math.round(weatherData.main.temp_max)}°${isCelsius ? 'C' : 'F'}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-tertiary/20 rounded-lg p-4">
                <h3 class="text-lg font-semibold mb-4">Wind & Pressure</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs text-text-secondary">Wind Speed</p>
                    <p class="text-xl font-semibold">${weatherData.wind.speed} m/s</p>
                  </div>
                  <div>
                    <p class="text-xs text-text-secondary">Wind Direction</p>
                    <p class="text-xl font-semibold">${weatherData.wind.deg}°</p>
                    <div class="relative w-10 h-10 mt-2">
                      <div class="absolute inset-0 border-2 border-brand rounded-full"></div>
                      <div class="absolute inset-0 flex items-center justify-center">
                        <div class="w-6 h-1 bg-brand" style="transform: rotate(${weatherData.wind.deg}deg)"></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p class="text-xs text-text-secondary">Pressure</p>
                    <p class="text-xl font-semibold">${weatherData.main.pressure} hPa</p>
                  </div>
                  <div>
                    <p class="text-xs text-text-secondary">Visibility</p>
                    <p class="text-xl font-semibold">${weatherData.visibility ? (weatherData.visibility / 1000) + ' km' : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-4 bg-tertiary/20 rounded-lg p-4">
              <h3 class="text-lg font-semibold mb-4">24-Hour Trend</h3>
              <div id="chart-container" class="h-64">
                <p class="text-center text-text-secondary py-10">Weather trend charts would be displayed here.</p>
                <p class="text-center text-text-secondary">(Using more advanced charting libraries would enable fully interactive charts)</p>
              </div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      const closeButton = modal.querySelector('.close-modal');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          modal.remove();
        });
      }
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    }
  };

  const value = {
    weatherData,
    forecastData,
    airQualityData,
    nearbyCities: nearbyCitiesData || [],
    nearbyCitiesData,
    loading,
    searchCity,
    isCelsius,
    toggleUnit,
    isDarkMode,
    toggleDarkMode,
    openMapView,
    openForecastView,
    openAnalyticsView
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};
