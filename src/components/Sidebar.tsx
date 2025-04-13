import React, { useState } from "react";
import { useWeather } from "@/context/WeatherContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Home, 
  PieChart, 
  MapPin, 
  Calendar, 
  Settings,
  LogOut,
  Sun,
  Moon,
  User,
  Bell,
  HelpCircle,
  Info,
  Menu
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";

const Sidebar: React.FC = () => {
  const { isDarkMode, toggleDarkMode, openMapView, openForecastView, openAnalyticsView } = useWeather();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const handleThemeToggle = () => {
    toggleDarkMode();
    // Apply theme classes to document
    if (isDarkMode) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  // Mobile navbar component
  const MobileNavbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-card-bg p-3 flex items-center justify-between lg:hidden">
      <button 
        className="p-2 rounded-full bg-tertiary"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu size={18} />
      </button>
      
      <div className="flex items-center">
        <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">FC</span>
        </div>
        <h2 className="ml-2 text-sm font-medium">Freshcast</h2>
      </div>
      
      <button 
        className="p-2 rounded-full bg-tertiary"
        onClick={() => setIsSettingsOpen(true)}
      >
        <Settings size={18} />
      </button>
    </nav>
  );
  
  // Mobile menu component
  const MobileMenu = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetContent side="left" className="bg-card-bg border-tertiary w-[250px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center py-4">
            <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">FC</span>
            </div>
            <h2 className="ml-3 text-lg font-medium">Freshcast</h2>
          </div>
          
          <div className="flex-1 flex flex-col gap-3 mt-6">
            <NavItems />
          </div>
          
          <div className="py-4 border-t border-tertiary mt-auto">
            <div className="flex items-center justify-between px-4">
              <span className="text-sm">Dark Theme</span>
              <Switch 
                checked={isDarkMode}
                onCheckedChange={handleThemeToggle}
                className="data-[state=checked]:bg-brand"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
  
  // Nav items component to reuse in both desktop and mobile
  const NavItems = () => (
    <>
      <a className="cursor-pointer group flex items-center gap-3 px-4 py-3 hover:bg-tertiary rounded-lg transition-colors">
        <Home 
          size={isMobile ? 20 : 24} 
          className="text-text-secondary group-hover:text-brand transition-colors" 
        />
        <span className="text-sm">Home</span>
      </a>

      <a className="cursor-pointer group flex items-center gap-3 px-4 py-3 hover:bg-tertiary rounded-lg transition-colors" onClick={openAnalyticsView}>
        <PieChart 
          size={isMobile ? 20 : 24} 
          className="text-text-secondary group-hover:text-brand transition-colors" 
        />
        <span className="text-sm">Analytics</span>
      </a>

      <a className="cursor-pointer group flex items-center gap-3 px-4 py-3 hover:bg-tertiary rounded-lg transition-colors" onClick={openMapView}>
        <MapPin 
          size={isMobile ? 20 : 24} 
          className="text-text-secondary group-hover:text-brand transition-colors" 
        />
        <span className="text-sm">Map</span>
      </a>

      <a className="cursor-pointer group flex items-center gap-3 px-4 py-3 hover:bg-tertiary rounded-lg transition-colors" onClick={openForecastView}>
        <Calendar 
          size={isMobile ? 20 : 24} 
          className="text-text-secondary group-hover:text-brand transition-colors" 
        />
        <span className="text-sm">Forecast</span>
      </a>
    </>
  );
  
  // For mobile view, show the navbar and slide-out menu
  if (isMobile) {
    return (
      <>
        <MobileNavbar />
        <MobileMenu />
        <div className="pb-14"></div> {/* Space for mobile navbar */}
        
        <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <SheetContent side="right" className="bg-card-bg border-tertiary w-[300px]">
            <SheetHeader>
              <SheetTitle className="text-xl">Settings</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-tertiary cursor-pointer transition-colors">
                    <User size={18} className="text-text-secondary" />
                    <span>Profile</span>
                  </div>
                  <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-tertiary cursor-pointer transition-colors">
                    <Bell size={18} className="text-text-secondary" />
                    <span>Notifications</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Appearance</h3>
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-tertiary transition-colors">
                  <div className="flex items-center gap-3">
                    {isDarkMode ? (
                      <Moon size={18} className="text-text-secondary" />
                    ) : (
                      <Sun size={18} className="text-text-secondary" />
                    )}
                    <span>Dark Theme</span>
                  </div>
                  <Switch 
                    checked={isDarkMode}
                    onCheckedChange={handleThemeToggle}
                    className="data-[state=checked]:bg-brand"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Help & Support</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-tertiary cursor-pointer transition-colors">
                    <HelpCircle size={18} className="text-text-secondary" />
                    <span>FAQ</span>
                  </div>
                  <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-tertiary cursor-pointer transition-colors">
                    <Info size={18} className="text-text-secondary" />
                    <span>About</span>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }
  
  // Desktop view
  return (
    <nav className="hidden lg:flex flex-col justify-between p-5 items-center rounded-3xl mt-5 h-[95vh] bg-card-bg w-20 animate-fade-in">
      <div className="flex flex-col items-center gap-10">
        <div className="flex items-center justify-center flex-col gap-2">
          <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">FC</span>
          </div>
          <h2 className="text-sm tracking-tighter">Freshcast</h2>
        </div>

        <div className="flex flex-col gap-10 items-center">
          <NavItems />
        </div>
      </div>

      <div className="flex flex-col gap-8 items-center">
        <a className="cursor-pointer"> 
          <LogOut size={24} className="text-text-secondary hover:text-brand transition-colors" /> 
        </a>
        
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex items-center gap-2">
            <Moon className="text-text-secondary h-4 w-4" />
            <Switch 
              checked={isDarkMode}
              onCheckedChange={handleThemeToggle}
              className="data-[state=checked]:bg-brand"
            />
            <Sun className="text-text-secondary h-4 w-4" />
          </div>
          <span className="text-xs text-text-secondary">Theme</span>
        </div>
      </div>

      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent side="right" className="bg-card-bg border-tertiary w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="text-xl">Settings</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Account</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-tertiary cursor-pointer transition-colors">
                  <User size={18} className="text-text-secondary" />
                  <span>Profile</span>
                </div>
                <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-tertiary cursor-pointer transition-colors">
                  <Bell size={18} className="text-text-secondary" />
                  <span>Notifications</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Appearance</h3>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-tertiary transition-colors">
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <Moon size={18} className="text-text-secondary" />
                  ) : (
                    <Sun size={18} className="text-text-secondary" />
                  )}
                  <span>Dark Theme</span>
                </div>
                <Switch 
                  checked={isDarkMode}
                  onCheckedChange={handleThemeToggle}
                  className="data-[state=checked]:bg-brand"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Help & Support</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-tertiary cursor-pointer transition-colors">
                  <HelpCircle size={18} className="text-text-secondary" />
                  <span>FAQ</span>
                </div>
                <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-tertiary cursor-pointer transition-colors">
                  <Info size={18} className="text-text-secondary" />
                  <span>About</span>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Sidebar;
