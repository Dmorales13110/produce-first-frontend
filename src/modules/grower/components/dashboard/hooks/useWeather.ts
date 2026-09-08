// src/modules/dashboard/hooks/useWeather.ts
import { useState, useEffect, useCallback } from 'react';
import { WeatherService, type WeatherData, type WeatherForecast } from '../../../../../services/weather';

interface UseWeatherReturn {
  weather: WeatherData | null;
  forecast: WeatherForecast[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useWeather = (lat?: number, lon?: number): UseWeatherReturn => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Intentar obtener ubicación del navegador
      let position: GeolocationPosition | null = null;
      let latFinal = lat || 20.5;
      let lonFinal = lon || -100.5;

      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 60000,
          });
        });
        position = pos;
        latFinal = pos.coords.latitude;
        lonFinal = pos.coords.longitude;
      } catch (geolocationError) {
        console.warn('⚠️ [useWeather] No se pudo obtener ubicación, usando default');
      }

      const [weatherData, forecastData] = await Promise.all([
        WeatherService.getCurrentWeather(latFinal, lonFinal),
        WeatherService.getForecast(latFinal, lonFinal),
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener el clima';
      setError(errorMessage);
      console.error('❌ [useWeather] Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => {
    fetchWeather();

    // Actualizar clima cada 30 minutos
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  return {
    weather,
    forecast,
    isLoading,
    error,
    refresh: fetchWeather,
  };
};