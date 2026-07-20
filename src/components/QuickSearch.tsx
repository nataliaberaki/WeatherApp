type QuickSearchProps = {
  onSearch: (city: string) => void;
};

// Keep shortcuts as data so adding or removing a city requires one edit.
const cities = [
  { label: "Oslo", value: "Oslo" },
  { label: "London", value: "London" },
  { label: "Paris", value: "Paris" },
  { label: "Tokyo", value: "Tokyo" },
  { label: "New York", value: "New York" },
];

function QuickSearch({ onSearch }: QuickSearchProps) {
  return (
    <section className="quick-search">
      <h3>Quick search</h3>

      <div className="quick-search-list">
        {cities.map((city) => (
          <button
            key={city.value}
            className="city-btn"
            type="button"
            onClick={() => onSearch(city.value)}
          >
            {city.label}
          </button>
        ))}
      </div>
    </section>
  );
}

export default QuickSearch;
