import { useEffect, useId, useRef, useState } from "react";
import type { Location } from "../types/location";
import { getLocationSuggestions } from "../services/weatherApi";

type SearchFormProps = {
  onSearch: (search: string | Location) => void;
};

function SearchForm({ onSearch }: SearchFormProps) {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const requestId = useRef(0);
  const activeSuggestionRequest = useRef<AbortController | null>(null);
  const inputId = useId();
  const listId = useId();

  // Debounce typing and cancel the previous request to prevent stale suggestions.
  useEffect(() => {
    const trimmedCity = city.trim();

    if (trimmedCity.length < 2) {
      return;
    }

    const currentRequest = ++requestId.current;
    const controller = new AbortController();
    activeSuggestionRequest.current = controller;

    const timer = window.setTimeout(async () => {
      try {
        const results = await getLocationSuggestions(
          trimmedCity,
          controller.signal
        );

        if (requestId.current === currentRequest) {
          setSuggestions(results);
          setActiveSuggestion(-1);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to load suggestions", error);
        }
      } finally {
        if (requestId.current === currentRequest) {
          activeSuggestionRequest.current = null;
          setIsSuggestionsLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();

      if (activeSuggestionRequest.current === controller) {
        activeSuggestionRequest.current = null;
      }
    };
  }, [city]);

  function dismissSuggestions() {
    requestId.current += 1;
    activeSuggestionRequest.current?.abort();
    activeSuggestionRequest.current = null;
    setSuggestions([]);
    setActiveSuggestion(-1);
    setIsSuggestionsLoading(false);
  }

  function clearSearch() {
    dismissSuggestions();
    setCity("");
  }

  function selectSuggestion(location: Location) {
    onSearch(location);
    clearSearch();
  }

  // Keep derived suggestion state in sync while the input changes.
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    requestId.current += 1;
    activeSuggestionRequest.current?.abort();
    activeSuggestionRequest.current = null;
    setCity(value);
    setActiveSuggestion(-1);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setIsSuggestionsLoading(false);
    } else {
      setIsSuggestionsLoading(true);
    }
  }

  // The input keeps focus while arrow keys move through the suggestion list.
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      dismissSuggestions();
      return;
    }

    if (suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestion((current) => (current + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestion(
        (current) => (current <= 0 ? suggestions.length - 1 : current - 1)
      );
    } else if (event.key === "Enter" && activeSuggestion >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[activeSuggestion]);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedCity = city.trim();

    if (!trimmedCity) {
      return;
    }

    onSearch(trimmedCity);
    clearSearch();
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={inputId}>
        Enter a city
      </label>

      <div className="search-input-wrapper">
        <input
          id={inputId}
          className="search-input"
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={suggestions.length > 0}
          aria-controls={listId}
          aria-activedescendant={
            activeSuggestion >= 0
              ? `${listId}-option-${activeSuggestion}`
              : undefined
          }
        />

        {isSuggestionsLoading && (
          <p className="suggestions-loading" role="status">
            Searching...
          </p>
        )}

        {suggestions.length > 0 && (
          <ul id={listId} className="suggestion-list" role="listbox">
            {suggestions.map((location, index) => (
              <li key={location.id} role="presentation">
                <button
                  id={`${listId}-option-${index}`}
                  type="button"
                  className="suggestion-item"
                  role="option"
                  aria-selected={activeSuggestion === index}
                  tabIndex={-1}
                  onMouseEnter={() => setActiveSuggestion(index)}
                  onClick={() => selectSuggestion(location)}
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
