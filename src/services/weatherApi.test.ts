import { afterEach, describe, expect, it, vi } from "vitest";
import { getCurrentWeather } from "./weatherApi";

describe("getCurrentWeather", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Confirms that valid API fields are converted into the app's WeatherData shape.
  it("returns normalized current weather", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          current: {
            temperature_2m: 12.5,
            wind_speed_10m: 4.2,
            relative_humidity_2m: 70,
            weather_code: 2,
          },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    );

    const result = await getCurrentWeather(59.91, 10.75);

    expect(result).toEqual({
      temperature: 12.5,
      windSpeed: 4.2,
      humidity: 70,
      weatherCode: 2,
    });
  });

  // Protects the app from accepting incomplete or incorrectly shaped API data.
  it("rejects malformed weather data", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ current: {} }), {
        status: 200,
      })
    );

    await expect(getCurrentWeather(59.91, 10.75)).rejects.toMatchObject({
      code: "invalid-response",
    });
  });

  // Ensures unsuccessful HTTP responses become a recognizable service error.
  it("rejects when the weather service fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, {
        status: 500,
        statusText: "Internal Server Error",
      })
    );

    await expect(getCurrentWeather(59.91, 10.75)).rejects.toMatchObject({
      code: "weather-failed",
    });
  });

  // Prevents the displayed m/s label from drifting out of sync with the API unit.
  it("requests wind speed in metres per second", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          current: {
            temperature_2m: 12,
            wind_speed_10m: 4,
            relative_humidity_2m: 70,
            weather_code: 1,
          },
        }),
        { status: 200 }
      )
    );

    await getCurrentWeather(59.91, 10.75);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("wind_speed_unit=ms"),
      expect.objectContaining({})
    );
  });
});
