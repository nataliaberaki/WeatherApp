import type { Location } from "../types/location";
import type { WeatherData } from "../types/weather";

type GeocodingResponse = {
  results?: Location[];
};

type ForecastResponse = {
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
    weather_code: number;
  };
};

/*loaction suggestions in the search bar */
export async function getLocationSuggestions(
  searchTerm: string
): Promise<Location[]> {
  const trimmedSearch = searchTerm.trim();

  if (trimmedSearch.length < 2) {
    return [];
  }

  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(trimmedSearch)}` +
    `&count=5` +
    `&language=en` +
    `&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not load location suggestions");
  }

  const data: GeocodingResponse = await response.json();

  return data.results ?? [];
}

/*fetch city details */
export async function getLocation(city: string): Promise<Location> {
  const searchParams = new URLSearchParams({
    name: city,
    count: "1",
    language: "en",
    format: "json",
  });

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${searchParams}`
  );

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
  /*const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;*/
  const searchParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${searchParams}`
  );

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
