
// Convert temperature between Celsius and Fahrenheit
export function convertTemperature(temp: number, isCelsius: boolean): number {
  return isCelsius ? temp : (temp * 9/5) + 32;
}

// Format date to display
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
}

// Format time (24h to 12h)
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  
  hours = hours % 12 || 12;
  
  return `${hours}:${minutes} ${ampm}`;
}

// Get AQI label based on index
export function getAQILabel(aqi: number): string {
  const labels = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"];
  return labels[aqi] || "Unknown";
}

// Get AQI color based on index
export function getAQIColor(aqi: number): string {
  const colors = ["", "#00E400", "#FFFF00", "#FF7E00", "#FF0000", "#8F3F97"];
  return colors[aqi] || "#999";
}

// Calculate day length from sunrise and sunset
export function calculateDayLength(sunrise: number, sunset: number): { hours: number; minutes: number } {
  const dayLengthMs = (sunset - sunrise) * 1000;
  const hours = Math.floor(dayLengthMs / (1000 * 60 * 60));
  const minutes = Math.floor((dayLengthMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return { hours, minutes };
}
