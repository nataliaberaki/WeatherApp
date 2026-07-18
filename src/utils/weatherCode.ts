export type WeatherInfo = {
  description: string;
  icon: string;
  background: string;
};
export function getWeatherInfo(code: number) {
  const weatherInfo: Record<number, WeatherInfo> = {
    0: {
      description: "Clear sky",
      icon: "☀️",
      background: "sunny",
    },

    1: {
      description: "Mainly clear",
      icon: "🌤️",
      background: "sunny",
    },

    2: {
      description: "Partly cloudy",
      icon: "⛅",
      background: "cloudy",
    },

    3: {
      description: "Overcast",
      icon: "☁️",
      background: "cloudy",
    },

    45: {
      description: "Fog",
      icon: "🌫️",
      background: "fog",
    },

    61: {
      description: "Light rain",
      icon: "🌦️",
      background: "rain",
    },

    63: {
      description: "Rain",
      icon: "🌧️",
      background: "rain",
    },

    71: {
      description: "Snow",
      icon: "❄️",
      background: "snow",
    },

    95: {
      description: "Thunderstorm",
      icon: "⛈️",
      background: "storm",
    },
  };
  return (
    weatherInfo[code] ?? {
      description: "Unknown weather",
      icon: "?",
      background: "default",
    }
  );
}
