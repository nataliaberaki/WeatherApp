import { useState } from "react";
import CurrentWeather from "./components/CurrentWeather";
import { getLocation, getCurrentWeather } from "./services/weatherApi";
import type { WeatherData } from "./types/weather";
import { getWeatherInfo } from "./utils/weatherCode";
import "./styles/app.css";
import Welcome from "./components/Welcome";

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
  function clearWeather() {
    setSelectedCity("");
    setWeather(null);
    setErrorMessage("");
  }

  return (
    <div className={`app ${weatherInfo?.background ?? "default"}`}>
      <header className="app-header">
        <button
          type="button"
          className="home-button"
          onClick={clearWeather}
          aria-label="Go to home page"
        >
          ☁️ Cloudy
        </button>
      </header>

      <main className="app-main">
        {!weather && !isLoading && !errorMessage && (
          <Welcome onSearch={handleSearch} />
        )}

        {isLoading && <p>Loading weather...</p>}

        {errorMessage && (
          <p className="error-message" role="alert">
            {errorMessage}
          </p>
        )}

        {selectedCity && weather && weatherInfo && !isLoading && (
          <CurrentWeather
            onClose={clearWeather}
            city={selectedCity}
            temperature={weather.temperature}
            description={weatherInfo.description}
            icon={weatherInfo.icon}
            windSpeed={weather.windSpeed}
            humidity={weather.humidity}
          />
        )}
      </main>

      <footer className="app-footer">Made by Natalia Beraki</footer>
    </div>
  );
}

export default App;
