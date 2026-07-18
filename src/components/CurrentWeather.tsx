type CurrentWeatherProps = {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  windSpeed: number;
  humidity: number;
  onClose: () => void;
};

function CurrentWeather({
  city,
  temperature,
  description,
  icon,
  windSpeed,
  humidity,
  onClose,
}: CurrentWeatherProps) {
  return (
    <section className="weather-card">
      <div className="weather-header">
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close Weather"
        >
          x
        </button>

        <h2 className="city-name">{city}</h2>
        <p className="temperature">{Math.round(temperature)}°</p>
        <span className="weather-icon" aria-hidden="true">
          {icon}
        </span>
        <p className="weather-description">{description}</p>
      </div>

      <div className="weather-details">
        <div className="detail-card">
          <span aria-hidden="true">💨</span>
          <div>
            <p className="detail-label">Wind</p>
            <p className="detail-value">{windSpeed} m/s</p>
          </div>
        </div>

        <div className="detail-card">
          <span aria-hidden="true">💧</span>
          <div>
            <p className="detail-label">Humidity</p>
            <p className="detail-value">{humidity}%</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CurrentWeather;
