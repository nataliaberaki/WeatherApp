type CurrentWeatherProps = {
  city: string;
  temperature: number;
  description: string;
  windSpeed: number;
  humidity: number;
};

function CurrentWeather({
  city,
  temperature,
  description,
  windSpeed,
  humidity,
}: CurrentWeatherProps) {
  return (
    <section className="weather-info">
      <div className="weather-header">
        <h2 id="city">{city}</h2>
        <h1 id="temperature">{temperature}</h1>
        <p>{description}</p>
      </div>
      <div className="weather-deatils">
        <p>Wind: {windSpeed} m/s</p>
        <p>Humidity: {humidity}%</p>
      </div>
    </section>
  );
}

export default CurrentWeather;
