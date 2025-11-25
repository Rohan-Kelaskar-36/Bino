import axios from "axios";
import { getCache, setCache } from "../utils/cache.js";

export const fetchWeather = async (city) => {
  const API_KEY = process.env.WEATHER_API_KEY; 

  if (!API_KEY) {
    const err = new Error("Weather API key not configured on server");
    err.status = 500;
    throw err;
  }

  const cacheKey = `${city}`;
  const cached = getCache(cacheKey);
  if (cached) return { fromCache: true, data: cached };

  const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}`;

  try {
    const res = await axios.get(url, { timeout: 8000 });
    const w = res.data;

    if (!w || !w.location || !w.current) {
      const e = new Error("Unexpected response from weather provider");
      e.status = 502;
      e.providerBody = w;
      throw e;
    }

    const cleanData = {
      city: w.location.name ?? null,
      country: w.location.country ?? null,
      temperature_c: w.current.temp_c ?? null,
      temperature_f: w.current.temp_f ?? null,
      feelsLike_c: w.current.feelslike_c ?? null,
      humidity: w.current.humidity ?? null,
      pressure_mb: w.current.pressure_mb ?? null,
      condition: w.current.condition?.text ?? null,
      icon: w.current.condition?.icon ?? null,
      wind_kph: w.current.wind_kph ?? null,
      wind_dir: w.current.wind_dir ?? null,
      last_updated: w.current.last_updated ?? null,
    };

    setCache(cacheKey, cleanData);
    return { fromCache: false, data: cleanData };

  } catch (error) {
    if (error.response) {
      const err = new Error("Weather provider returned an error");
      err.status = error.response.status || 502;
      err.providerBody = error.response.data;
      throw err;
    }
    if (error.request) {
      const err = new Error("No response from weather provider");
      err.status = 504;
      throw err;
    }
    const err = new Error("Internal error fetching weather");
    err.status = 500;
    throw err;
  }
};
