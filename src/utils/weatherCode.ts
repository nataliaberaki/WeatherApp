export function getWeatherDescription(code: number) {
  const weatherDescriptions = {
    0: "Clear sky",
    1: "Mainly clear sky",
    2: "Partly cloudy",
    3: "Overcast",
    4: "Partly rain",
    5: "Rain",
    6: "Extrem weather",
  };
  return weatherDescriptions[code];
}
