export type WeatherInfo = {
  description: string;
  icon: string;
  background: string;
};

// Open-Meteo uses WMO codes; each code controls both content and page theme.
const weatherInfo: Record<number, WeatherInfo> = {
  0: { description: "Clear sky", icon: "☀️", background: "sunny" },
  1: { description: "Mainly clear", icon: "🌤️", background: "sunny" },
  2: { description: "Partly cloudy", icon: "⛅", background: "cloudy" },
  3: { description: "Overcast", icon: "☁️", background: "cloudy" },
  45: { description: "Fog", icon: "🌫️", background: "fog" },
  48: { description: "Rime fog", icon: "🌫️", background: "fog" },
  51: { description: "Light drizzle", icon: "🌦️", background: "rain" },
  53: { description: "Drizzle", icon: "🌦️", background: "rain" },
  55: { description: "Heavy drizzle", icon: "🌧️", background: "rain" },
  56: { description: "Light freezing drizzle", icon: "🌧️", background: "rain" },
  57: { description: "Freezing drizzle", icon: "🌧️", background: "rain" },
  61: { description: "Light rain", icon: "🌦️", background: "rain" },
  63: { description: "Rain", icon: "🌧️", background: "rain" },
  65: { description: "Heavy rain", icon: "🌧️", background: "rain" },
  66: { description: "Light freezing rain", icon: "🌧️", background: "rain" },
  67: { description: "Freezing rain", icon: "🌧️", background: "rain" },
  71: { description: "Light snow", icon: "🌨️", background: "snow" },
  73: { description: "Snow", icon: "❄️", background: "snow" },
  75: { description: "Heavy snow", icon: "❄️", background: "snow" },
  77: { description: "Snow grains", icon: "🌨️", background: "snow" },
  80: { description: "Light rain showers", icon: "🌦️", background: "rain" },
  81: { description: "Rain showers", icon: "🌧️", background: "rain" },
  82: { description: "Heavy rain showers", icon: "🌧️", background: "rain" },
  85: { description: "Light snow showers", icon: "🌨️", background: "snow" },
  86: { description: "Heavy snow showers", icon: "❄️", background: "snow" },
  95: { description: "Thunderstorm", icon: "⛈️", background: "storm" },
  96: {
    description: "Thunderstorm with hail",
    icon: "⛈️",
    background: "storm",
  },
  99: {
    description: "Severe thunderstorm with hail",
    icon: "⛈️",
    background: "storm",
  },
};

export function getWeatherInfo(code: number): WeatherInfo {
  // Unknown future codes still receive a safe, readable fallback.
  return (
    weatherInfo[code] ?? {
      description: "Unknown weather",
      icon: "?",
      background: "default",
    }
  );
}
