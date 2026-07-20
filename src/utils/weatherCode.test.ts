import { describe, expect, it } from "vitest";
import { getWeatherInfo } from "./weatherCode";

describe("getWeatherInfo", () => {
  // Verifies the clear-sky code uses the expected text, icon, and theme.
  it("maps clear weather", () => {
    expect(getWeatherInfo(0)).toEqual({
      description: "Clear sky",
      icon: "☀️",
      background: "sunny",
    });
  });

  // Checks a severe rain code from the WMO mapping.
  it("maps heavy rain", () => {
    expect(getWeatherInfo(65)).toEqual({
      description: "Heavy rain",
      icon: "🌧️",
      background: "rain",
    });
  });

  // Confirms hail-producing storms receive the storm presentation.
  it("maps a thunderstorm with hail", () => {
    expect(getWeatherInfo(96)).toEqual({
      description: "Thunderstorm with hail",
      icon: "⛈️",
      background: "storm",
    });
  });

  // Ensures unsupported future codes still produce a safe UI fallback.
  it("uses a safe fallback for unknown codes", () => {
    expect(getWeatherInfo(999)).toEqual({
      description: "Unknown weather",
      icon: "?",
      background: "default",
    });
  });
});
