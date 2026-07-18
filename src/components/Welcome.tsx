import SearchForm from "./SearchForm";

type WelcomeProps = {
  onSearch: (city: string) => void;
};

const popularCities = [
  { name: "Oslo", flag: "🇳🇴" },
  { name: "London", flag: "🇬🇧" },
  { name: "Paris", flag: "🇫🇷" },
  { name: "Tokyo", flag: "🇯🇵" },
  { name: "New York", flag: "🇺🇸" },
];

function Welcome({ onSearch }: WelcomeProps) {
  return (
    <section className="welcome">
      <h2 className="welcome-title">Discover weather anywhere</h2>

      <p className="welcome-text">
        Search for any city to see the current weather conditions
      </p>

      <div className="welcome-search">
        <SearchForm onSearch={onSearch} />
      </div>

      <div className="quick-search">
        <h3>Quick search</h3>

        <div className="quick-search-list">
          {popularCities.map((city) => (
            <button
              key={city.name}
              className="city-btn"
              type="button"
              onClick={() => onSearch(city.name)}
            >
              <span aria-hidden="true">{city.flag}</span>
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Welcome;
