import { useState } from "react";
import type { Location } from "../types/location";
import { getLocationSuggestions } from "../services/weatherApi";

type SearchFormProps = {
  onSearch: (city: string) => void;
};

function SearchForm({ onSearch }: SearchFormProps) {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<Location[]>([]);

  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

  //handles suggestions
  function handleSuggestionClick(location: Location) {
    onSearch(location.name);
    setCity("");
    setSuggestions([]);
  }

  /*gets the suggestions */
  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setCity(value);

    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSuggestionsLoading(true);

    try {
      const results = await getLocationSuggestions(value);
      setSuggestions(results);
    } finally {
      setIsSuggestionsLoading(false);
    }
  }

  //submit function
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedCity = city.trim();

    if (!trimmedCity) {
      return;
    }

    onSearch(trimmedCity);
    setCity("");
    setSuggestions([]);
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="city-search">
        Enter a city
      </label>

      <div className="search-input-wrapper">
        <input
          id="city-search"
          className="search-input"
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={handleChange}
          autoComplete="off"
        />

        {isSuggestionsLoading && (
          <p className="suggestions-loading">Searching...</p>
        )}

        {suggestions.length > 0 && (
          <ul className="suggestion-list">
            {suggestions.map((location) => (
              <li key={location.id}>
                <button
                  type="button"
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(location)}
                >
                  <strong>{location.name}</strong>

                  <span>
                    {[location.admin1, location.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className="search-button" type="submit">
        Search
      </button>
    </form>
  );
}

export default SearchForm;
