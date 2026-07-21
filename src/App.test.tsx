import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { WeatherApiError } from "./services/weatherApi";
import type { Location } from "./types/location";
import type { WeatherData } from "./types/weather";

// Hoisted mocks replace network services before App is imported by Vitest.
const { getLocationMock, getCurrentWeatherMock, getLocationSuggestionsMock } =
  vi.hoisted(() => ({
    getLocationMock: vi.fn(),
    getCurrentWeatherMock: vi.fn(),
    getLocationSuggestionsMock: vi.fn(),
  }));

vi.mock("./services/weatherApi", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./services/weatherApi")>();

  return {
    ...actual,
    getLocation: getLocationMock,
    getCurrentWeather: getCurrentWeatherMock,
    getLocationSuggestions: getLocationSuggestionsMock,
  };
});

// Shared fixtures keep successful-search tests consistent and easy to read.
const oslo: Location = {
  id: 1,
  name: "Oslo",
  latitude: 59.91,
  longitude: 10.75,
  country: "Norway",
};

const clearWeather: WeatherData = {
  temperature: 18.4,
  windSpeed: 3.2,
  humidity: 60,
  weatherCode: 0,
};

// Submit the welcome form the same way a user would in each integration test.
function submitCity(city = "Oslo") {
  fireEvent.change(screen.getByRole("combobox"), {
    target: { value: city },
  });
  fireEvent.click(screen.getByRole("button", { name: "Search" }));
}

describe("App", () => {
  // Prevent mock results and call counts from leaking between tests.
  beforeEach(() => {
    getLocationMock.mockReset();
    getCurrentWeatherMock.mockReset();
    getLocationSuggestionsMock.mockReset();
  });

  // Confirms users receive immediate feedback while a search is in progress.
  it("shows a loading status during a weather request", async () => {
    let resolveLocation!: (location: Location) => void;
    getLocationMock.mockReturnValue(
      new Promise<Location>((resolve) => {
        resolveLocation = resolve;
      })
    );
    getCurrentWeatherMock.mockResolvedValue(clearWeather);
    render(<App />);

    submitCity();
    expect(screen.getByRole("status")).toHaveTextContent("Loading weather...");

    resolveLocation(oslo);
    expect(await screen.findByRole("heading", { name: "Oslo" })).toBeInTheDocument();
  });

  // Verifies a successful search replaces the welcome screen with weather data.
  it("displays weather returned by the services", async () => {
    getLocationMock.mockResolvedValue(oslo);
    getCurrentWeatherMock.mockResolvedValue(clearWeather);
    render(<App />);

    submitCity();

    expect(await screen.findByRole("heading", { name: "Oslo" })).toBeInTheDocument();
    expect(screen.getByText("Norway")).toBeInTheDocument();
    expect(screen.getByText("18°")).toBeInTheDocument();
    expect(screen.getByText("Clear sky")).toBeInTheDocument();
  });

  // Ensures a missing city receives specific, actionable feedback.
  it("shows a city-not-found message", async () => {
    getLocationMock.mockRejectedValue(
      new WeatherApiError("location-not-found", "City not found")
    );
    render(<App />);

    submitCity("Not a city");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "City not found. Check the spelling or choose a suggestion."
    );
  });

  // Keeps network failures distinct from invalid search input.
  it("shows a service error when the request fails", async () => {
    getLocationMock.mockRejectedValue(
      new WeatherApiError("geocoding-failed", "Service unavailable")
    );
    render(<App />);

    submitCity();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not connect to the weather service. Please try again."
    );
  });

  // Confirms the close action clears weather and restores the home screen.
  it("returns to the welcome screen when weather is closed", async () => {
    getLocationMock.mockResolvedValue(oslo);
    getCurrentWeatherMock.mockResolvedValue(clearWeather);
    render(<App />);

    submitCity();
    await screen.findByRole("heading", { name: "Oslo" });
    fireEvent.click(screen.getByRole("button", { name: "Close weather" }));

    expect(
      screen.getByRole("heading", { name: "Discover weather anywhere" })
    ).toBeInTheDocument();
  });
});
