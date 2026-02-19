import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface WeatherData {
  city: string;
  temp: number;
  description: string;
  humidity: number;
  feelsLike: number;
  icon: string;
}

export const WeatherWidget: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [locationError, setLocationError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current location weather - INSTANT, no latency
  const fetchCurrentLocationWeather = useCallback(async (lat: number, lon: number) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/weather/current?lat=${lat}&lon=${lon}`
      );
      
      if (res.data.error) {
        setLocationError(res.data.error);
        setIsLoading(false);
      } else {
        setCurrentWeather(res.data);
        setLastUpdated(new Date());
        setLocationError('');
        setIsLoading(false);
      }
    } catch (err) {
      setLocationError('Error fetching weather data');
      setIsLoading(false);
    }
  }, []);

  // Get user's geolocation and fetch weather
  const initCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchCurrentLocationWeather(latitude, longitude);
      },
      (error) => {
        setLocationError(`Location error: ${error.message}`);
        setIsLoading(false);
      }
    );
  }, [fetchCurrentLocationWeather]);

  // Initialize on mount and set up 5-minute auto-refresh
  useEffect(() => {
    initCurrentLocation();
    
    // Refresh every 5 minutes (300000 ms)
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing weather (5 min interval)');
      initCurrentLocation();
    }, 300000);

    return () => clearInterval(interval);
  }, [initCurrentLocation]);

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-2xl w-full max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg">📍 Live Weather</h3>
        <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded animate-pulse">LIVE</span>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-pulse text-center">
            <div className="text-2xl mb-2">🌍</div>
            <div className="text-sm">Getting location...</div>
          </div>
        </div>
      ) : locationError ? (
        <div className="text-sm text-red-200 py-4">{locationError}</div>
      ) : currentWeather ? (
        <div className="space-y-2">
          <div className="text-2xl font-bold">{currentWeather.city}</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold">{Math.round(currentWeather.temp)}°C</div>
              <div className="text-sm opacity-90 capitalize">{currentWeather.description}</div>
            </div>
            <img 
              src={`https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
              alt="weather icon"
              className="w-20 h-20"
            />
          </div>
          <div className="text-xs opacity-75 space-y-1">
            <div>Feels like: {Math.round(currentWeather.feelsLike)}°C</div>
            <div>Humidity: {currentWeather.humidity}%</div>
          </div>
          {lastUpdated && (
            <div className="text-xs opacity-60 mt-2 pt-2 border-t border-white border-opacity-20">
              ⏱️ Updated: {lastUpdated.toLocaleTimeString()}
              <div className="text-[10px] mt-1">Auto-refresh: Every 5 min</div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
