import { useRef, useState } from "react";
import CurrentWeather from "./components/CurrentWeather";
import {
  getLocation,
  getCurrentWeather,
  WeatherApiError,
} from "./services/weatherApi";
import type { WeatherData } from "./types/weather";
import { getWeatherInfo } from "./utils/weatherCode";
import "./styles/app.css";
import type { Location } from "./types/location";
import Welcome from "./components/Welcome";
import SearchForm from "./components/SearchForm";

function App() {
  // Location and weather are stored separately because they come from two APIs.
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Only the latest search is allowed to update the page.
  const activeRequest = useRef<AbortController | null>(null);
  const weatherInfo = weather ? getWeatherInfo(weather.weatherCode) : null;

  async function handleSearch(search: string | Location) {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const location =
        typeof search === "string"
          ? await getLocation(search, controller.signal)
          : search;

      const weatherData = await getCurrentWeather(
        location.latitude,
        location.longitude,
        controller.signal
      );

      setSelectedLocation(location);
      setWeather(weatherData);
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      setWeather(null);
      setSelectedLocation(null);

      // Show messages that describe the actual failure instead of one generic error.
      if (
        error instanceof WeatherApiError &&
        error.code === "location-not-found"
      ) {
        setErrorMessage(
          "City not found. Check the spelling or choose a suggestion."
        );
      } else if (
        error instanceof WeatherApiError &&
        error.code === "invalid-response"
      ) {
        setErrorMessage("Weather data is temporarily unavailable.");
      } else {
        setErrorMessage(
          "Could not connect to the weather service. Please try again."
        );
      }
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setIsLoading(false);
      }
    }
  }

  function clearWeather() {
    activeRequest.current?.abort();
    activeRequest.current = null;
    setSelectedLocation(null);
    setWeather(null);
    setIsLoading(false);
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
        {!weather && !isLoading && (
          <Welcome onSearch={handleSearch} errorMessage={errorMessage} />
        )}

        {isLoading && (
          <p className="weather-loading" role="status">
            Loading weather...
          </p>
        )}

        {selectedLocation && weather && weatherInfo && !isLoading && (
          <section className="weather-results">
            <div className="results-search">
              <SearchForm onSearch={handleSearch} />
            </div>

            <CurrentWeather
              onClose={clearWeather}
              city={selectedLocation.name}
              country={selectedLocation.country}
              temperature={weather.temperature}
              description={weatherInfo.description}
              icon={weatherInfo.icon}
              windSpeed={weather.windSpeed}
              humidity={weather.humidity}
            />
          </section>
        )}
      </main>

      <footer className="app-footer">Made by Natalia Beraki</footer>
    </div>
  );
}

export default App;
