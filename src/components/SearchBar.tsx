
import React, { useState, KeyboardEvent } from "react";
import { useWeather } from "@/context/WeatherContext";
import { Search } from "lucide-react";

const SearchBar: React.FC = () => {
  const { searchCity } = useWeather();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchCity(searchQuery);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-md bg-card-bg flex items-center gap-3 py-3 rounded-3xl px-5 animate-fade-in">
      <Search 
        size={20} 
        className="text-text-secondary cursor-pointer" 
        onClick={handleSearch}
      />
      <input
        className="w-full outline-none bg-transparent text-white placeholder:text-text-secondary"
        type="text"
        placeholder="Enter the city..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default SearchBar;
