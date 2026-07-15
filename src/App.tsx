import { useState } from "react";
import SearchForm from "./components/SearchForm";
import CurrentWeather from "./components/CurrentWeather";
import { getLocation, getCurrentWeather } from "./services/weatherApi";

function App() {
  const [selectedCity, setSelectedCity] = useState("");

  /*function handleSearch(city: string) {
    setSelectedCity(city);
  }*/

  async function handleSearch(city: string) {
    try {
      const location = await getLocation(city);

      const weather = await getCurrentWeather(
        location.latitude,
        location.longitude
      );

      console.log("Location:", location);
      console.log("Weather:", weather);

      setSelectedCity(location.name);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main>
      <h1>Weather App</h1>

      <SearchForm onSearch={handleSearch} />

      {selectedCity && (
        <CurrentWeather
          city={selectedCity}
          temperature={18}
          description="Cloudy"
          windSpeed={5}
          humidity={72}
        />
      )}
    </main>
  );
}

export default App;
