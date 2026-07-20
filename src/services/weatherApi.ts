import type { Location } from "../types/location";
import type { WeatherData } from "../types/weather";

type ForecastResponse = {
  current?: {
    temperature_2m: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
    weather_code: number;
  };
};

export type WeatherApiErrorCode =
  | "location-not-found"
  | "geocoding-failed"
  | "weather-failed"
  | "invalid-response";

// Error codes let the UI distinguish missing cities from service failures.
export class WeatherApiError extends Error {
  readonly code: WeatherApiErrorCode;

  constructor(code: WeatherApiErrorCode, message: string) {
    super(message);
    this.name = "WeatherApiError";
    this.code = code;
  }
}

function isLocation(value: unknown): value is Location {
  if (!value || typeof value !== "object") {
    return false;
  }

  const location = value as Record<string, unknown>;

  return (
    typeof location.id === "number" &&
    typeof location.name === "string" &&
    typeof location.latitude === "number" &&
    typeof location.longitude === "number"
  );
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

// Network responses are untrusted, so validate them before using TypeScript types.
function readLocations(value: unknown): Location[] | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const results = (value as { results?: unknown }).results;

  if (results === undefined) {
    return [];
  }

  return Array.isArray(results) ? results.filter(isLocation) : null;
}

export async function getLocationSuggestions(
  searchTerm: string,
  signal?: AbortSignal
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

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new WeatherApiError(
      "geocoding-failed",
      "Could not load location suggestions"
    );
  }

  const locations = readLocations(await response.json());

  if (!locations) {
    throw new WeatherApiError(
      "invalid-response",
      "Location service returned invalid data"
    );
  }

  return locations;
}

// Resolve a typed city record before requesting its weather.
export async function getLocation(
  city: string,
  signal?: AbortSignal
): Promise<Location> {
  const searchParams = new URLSearchParams({
    name: city,
    count: "1",
    language: "en",
    format: "json",
  });

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${searchParams}`,
    { signal }
  );

  if (!response.ok) {
    throw new WeatherApiError(
      "geocoding-failed",
      "Failed to fetch location"
    );
  }

  const locations = readLocations(await response.json());

  if (!locations) {
    throw new WeatherApiError(
      "invalid-response",
      "Location service returned invalid data"
    );
  }

  const location = locations[0];

  if (!location || !isLocation(location)) {
    throw new WeatherApiError("location-not-found", "City not found");
  }

  return location;
}

// Fetch only the current values displayed by the weather card.
export async function getCurrentWeather(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<WeatherData> {
  const searchParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
    wind_speed_unit: "ms",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${searchParams}`,
    { signal }
  );

  if (!response.ok) {
    throw new WeatherApiError("weather-failed", "Failed to fetch weather");
  }

  const data: unknown = await response.json();
  const current =
    data && typeof data === "object"
      ? (data as ForecastResponse).current
      : undefined;

  if (
    !current ||
    !isFiniteNumber(current.temperature_2m) ||
    !isFiniteNumber(current.wind_speed_10m) ||
    !isFiniteNumber(current.relative_humidity_2m) ||
    !isFiniteNumber(current.weather_code)
  ) {
    throw new WeatherApiError(
      "invalid-response",
      "Weather service returned invalid data"
    );
  }

  return {
    temperature: current.temperature_2m,
    windSpeed: current.wind_speed_10m,
    humidity: current.relative_humidity_2m,
    weatherCode: current.weather_code,
  };
}
