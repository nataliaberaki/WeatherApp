// Weather values are normalized from the API before reaching the UI.
export type WeatherData = {
  temperature: number;
  windSpeed: number;
  humidity: number;
  weatherCode: number;
};
