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
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="city">Enter a city...</label>

      <input
        id="city"
        type="text"
        placeholder="e.g. Oslo"
        value={city}
        onChange={(event) => setCity(event.target.value)}
      />

      <button type="submit">Search</button>
    </form>
  );
}

export default SearchForm;
