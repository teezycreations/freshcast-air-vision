
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
import { useIsMobile } from "@/hooks/use-mobile";

const WeatherDashboard: React.FC = () => {
  const { loading } = useWeather();
  const isMobile = useIsMobile();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex relative">
      <Sidebar />
      
      <div className="flex-1 p-1 sm:p-3 md:p-5 w-full overflow-hidden">
        <ScrollArea className="h-[98vh] hide-scrollbar">
          <div className="container mx-auto px-1 py-4 sm:py-8 mt-14 lg:mt-0">
            {isMobile && (
              <div className="mb-3">
                <SearchBar />
              </div>
            )}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-6">
              <div className="space-y-3 sm:space-y-6">
                {!isMobile && <SearchBar />}
                <WeatherCard />
                <WeeklyForecast />
              </div>
              
              <div className="space-y-3 sm:space-y-6">
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
