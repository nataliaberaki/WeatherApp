import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import CurrentWeather from "./CurrentWeather";

describe("CurrentWeather", () => {
  // Confirms every important weather value is visible to the user.
  it("displays the current weather", () => {
    render(
      <CurrentWeather
        city="Oslo"
        country="Norway"
        temperature={18.4}
        description="Partly cloudy"
        icon="⛅"
        windSpeed={4.2}
        humidity={70}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByRole("heading", { name: "Oslo" })).toBeInTheDocument();
    expect(screen.getByText("Norway")).toBeInTheDocument();
    expect(screen.getByText("18°")).toBeInTheDocument();
    expect(screen.getByText("Partly cloudy")).toBeInTheDocument();
    expect(screen.getByText("4.2 m/s")).toBeInTheDocument();
    expect(screen.getByText("70%")).toBeInTheDocument();
  });

  // Verifies the close control notifies its parent component once.
  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <CurrentWeather
        city="Oslo"
        country="Norway"
        temperature={18}
        description="Clear sky"
        icon="☀️"
        windSpeed={3}
        humidity={60}
        onClose={onClose}
      />
    );

    const closeButton = screen.getByRole("button", {
      name: "Close weather",
    });

    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledOnce();
  });
});
