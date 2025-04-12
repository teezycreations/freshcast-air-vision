
import React from "react";
import { WeatherProvider } from "@/context/WeatherContext";
import { useWeather } from "@/context/WeatherContext";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import WeatherCard from "@/components/WeatherCard";
import WeeklyForecast from "@/components/WeeklyForecast";
import AQICard from "@/components/AQICard";
import NearbyCities from "@/components/NearbyCities";
import LoadingScreen from "@/components/LoadingScreen";
import { ScrollArea } from "@/components/ui/scroll-area";

const WeatherDashboard: React.FC = () => {
  const { loading } = useWeather();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex relative">
      <Sidebar />
      
      <div className="flex-1 p-3 sm:p-5 w-full overflow-hidden">
        <ScrollArea className="h-[98vh]">
          <div className="container mx-auto px-1 py-6 sm:py-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                <SearchBar />
                <WeatherCard />
                <WeeklyForecast />
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <AQICard />
                <NearbyCities />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

const IndexPage: React.FC = () => {
  return (
    <WeatherProvider>
      <WeatherDashboard />
    </WeatherProvider>
  );
};

export default IndexPage;
