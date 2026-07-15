import type { Location } from "../types/location";

type GeocodingResponse = {
  results?: Location[];
};

export type WeatherData = {
  temperature: number;
  windSpeed: number;
  humidity: number;
  weatherCode: number;
};

type ForecastResponse = {
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
    weather_code: number;
  };
};

export async function getLocation(city: string): Promise<Location> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1&language=en&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch location");
  }

  const data: GeocodingResponse = await response.json();
  const location = data.results?.[0];

  if (!location) {
    throw new Error("City not found");
  }

  return location;
}

export async function getCurrentWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch weather");
  }

  const data: ForecastResponse = await response.json();

  return {
    temperature: data.current.temperature_2m,
    windSpeed: data.current.wind_speed_10m,
    humidity: data.current.relative_humidity_2m,
    weatherCode: data.current.weather_code,
  };
}
