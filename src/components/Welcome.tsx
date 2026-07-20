import SearchForm from "./SearchForm";
import QuickSearch from "./QuickSearch";
import type { Location } from "../types/location";

type WelcomeProps = {
  onSearch: (search: string | Location) => void;
  errorMessage?: string;
};

function Welcome({ onSearch, errorMessage }: WelcomeProps) {
  return (
    <section className="welcome">
      {/* The welcome screen combines free-text search with common shortcuts. */}
      <h1 className="welcome-title">Discover weather anywhere</h1>

      <p className="welcome-text">
        Search for any city to see the current weather conditions
      </p>

      <div className="welcome-search">
        <SearchForm onSearch={onSearch} />
      </div>

      {errorMessage && (
        <p className="error-message" role="alert">
          {errorMessage}
        </p>
      )}

      <QuickSearch onSearch={onSearch} />
    </section>
  );
}

export default Welcome;
