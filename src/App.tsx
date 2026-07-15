import { useState } from "react";
import SearchForm from "./components/SearchForm";
import CurrentWeather from "./components/CurrentWeather";
import {
  getLocation,
  getCurrentWeather,
  type WeatherData,
} from "./services/weatherApi";
import { getWeatherDescription } from "./utils/weatherCode";

function App() {
  const [selectedCity, setSelectedCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null); //WeatherData | null meaning either there is data or no data

  /*function handleSearch(city: string) {
    setSelectedCity(city);
  }*/

  async function handleSearch(city: string) {
    try {
      const location = await getLocation(city);

      const weatherData = await getCurrentWeather(
        location.latitude,
        location.longitude
      );

      /*console.log("Location:", location);
      console.log("Weather:", weather);*/

      setSelectedCity(location.name);
      setWeather(weatherData);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main>
      <h1>Weather App</h1>

      <SearchForm onSearch={handleSearch} />

      {selectedCity && weather && (
        <CurrentWeather
          city={selectedCity}
          temperature={weather.temperature}
          description={getWeatherDescription(weather.weatherCode)}
          windSpeed={weather.windSpeed}
          humidity={weather.humidity}
        />
      )}
    </main>
  );
}

export default App;
