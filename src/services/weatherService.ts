
const API_KEY = "6453684fd96817bb165fbd7ac20c745b";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
}

export interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
      deg: number;
    };
    dt_txt: string;
  }[];
  city: {
    name: string;
    country: string;
  };
}

export interface AirQualityData {
  list: {
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }[];
}

export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error("City not found");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
}

export async function fetchWeatherByLocation(lat: number, lon: number): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error("Weather data not available");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
}

export async function fetchForecast(lat: number, lon: number): Promise<ForecastData> {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error("Forecast data not available");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
}

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityData> {
  try {
    const response = await fetch(
      `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("Air quality data not available");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching air quality:", error);
    throw error;
  }
}

export async function fetchNearbyCities(lat: number, lon: number): Promise<WeatherData[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/find?lat=${lat}&lon=${lon}&cnt=4&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error("Nearby cities data not available");
    }
    
    const data = await response.json();
    return data.list;
  } catch (error) {
    console.error("Error fetching nearby cities:", error);
    throw error;
  }
}
