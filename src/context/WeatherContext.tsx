
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

interface WeatherContextType {
  weatherData: WeatherData | null;
  forecastData: ForecastData | null;
  airQualityData: AirQualityData | null;
  nearbyCities: WeatherData[];
  loading: boolean;
  error: string | null;
  isCelsius: boolean;
  toggleUnit: () => void;
  searchCity: (city: string) => Promise<void>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

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
  const [nearbyCities, setNearbyCities] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Get user's location and fetch weather data on mount
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

  // Function to fetch all required weather data
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
      setNearbyCities(nearby);
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

  // Search for a city
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

  // Toggle temperature unit
  const toggleUnit = () => {
    setIsCelsius(!isCelsius);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("light");
  };

  const value = {
    weatherData,
    forecastData,
    airQualityData,
    nearbyCities,
    loading,
    error,
    isCelsius,
    toggleUnit,
    searchCity,
    isDarkMode,
    toggleDarkMode,
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};
