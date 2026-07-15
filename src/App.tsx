import { useState } from "react";
import SearchForm from "./components/SearchForm";
import CurrentWeather from "./components/CurrentWeather";
import { getLocation, getCurrentWeather } from "./services/weatherApi";
import type { WeatherData } from "./types/weather";
import { getWeatherInfo } from "./utils/weatherCode";

function App() {
  const [selectedCity, setSelectedCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null); //WeatherData | null meaning either there is data or no data
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  /*function handleSearch(city: string) {
    setSelectedCity(city);
  }*/

  const weatherInfo = weather ? getWeatherInfo(weather.weatherCode) : null;

  async function handleSearch(city: string) {
    setIsLoading(true);
    setErrorMessage("");

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
      setWeather(null);
      setSelectedCity("");

      //if error occurs
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <h1>Weather App</h1>

      <SearchForm onSearch={handleSearch} />

      {isLoading && <p>Loading weather...</p>}

      {errorMessage && <p role="alert">{errorMessage}</p>}

      {selectedCity && weather && !isLoading && (
        <CurrentWeather
          city={selectedCity}
          temperature={weather.temperature}
          description={weatherInfo.description}
          icon={weatherInfo.icon}
          windSpeed={weather.windSpeed}
          humidity={weather.humidity}
        />
      )}
    </main>
  );
}

export default App;
