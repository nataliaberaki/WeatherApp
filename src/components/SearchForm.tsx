import { useState } from "react";

type SearchFormProps = {
  onSearch: (city: string) => void;
};

function SearchForm({ onSearch }: SearchFormProps) {
  const [city, setCity] = useState("");

  //submit function
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedCity = city.trim();

    if (!trimmedCity) {
      return;
    }

    onSearch(trimmedCity);
    setCity("");
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="city-search">
        Enter a city
      </label>

      <input
        id="city-search"
        className="search-input"
        type="text"
        placeholder="Search for a city..."
        value={city}
        onChange={(event) => setCity(event.target.value)}
      />

      <button className="search-button" type="submit">
        Search
      </button>
    </form>
  );
}

export default SearchForm;
