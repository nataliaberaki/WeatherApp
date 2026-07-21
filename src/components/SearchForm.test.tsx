import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SearchForm from "./SearchForm";
import type { Location } from "../types/location";

// Hoisting makes the suggestion service mock available when Vitest loads the module.
const { getLocationSuggestionsMock } = vi.hoisted(() => ({
  getLocationSuggestionsMock: vi.fn(),
}));

vi.mock("../services/weatherApi", () => ({
  getLocationSuggestions: getLocationSuggestionsMock,
}));

const oslo: Location = {
  id: 1,
  name: "Oslo",
  latitude: 59.91,
  longitude: 10.75,
  country: "Norway",
};

// Advance only the component's 300 ms debounce while keeping tests deterministic.
async function finishDebounce() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(300);
  });
}

describe("SearchForm", () => {
  // Fake timers avoid waiting in real time for every autocomplete test.
  beforeEach(() => {
    vi.useFakeTimers();
    getLocationSuggestionsMock.mockReset();
  });

  // Restore real browser timers so this file cannot affect other test suites.
  afterEach(() => {
    vi.useRealTimers();
  });

  // Avoids unnecessary API requests until enough text has been entered.
  it("does not request suggestions for fewer than two characters", async () => {
    render(<SearchForm onSearch={vi.fn()} />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "O" },
    });
    await finishDebounce();

    expect(getLocationSuggestionsMock).not.toHaveBeenCalled();
  });

  // Confirms debounced API results are presented as accessible options.
  it("displays location suggestions after the debounce", async () => {
    getLocationSuggestionsMock.mockResolvedValue([oslo]);
    render(<SearchForm onSearch={vi.fn()} />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Oslo" },
    });
    expect(screen.getByRole("status")).toHaveTextContent("Searching...");

    await finishDebounce();

    expect(screen.getByRole("option", { name: /Oslo/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  // Verifies keyboard users can move to and select a suggestion.
  it("selects the active suggestion with the keyboard", async () => {
    const onSearch = vi.fn();
    getLocationSuggestionsMock.mockResolvedValue([oslo]);
    render(<SearchForm onSearch={onSearch} />);

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "Oslo" } });
    await finishDebounce();
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSearch).toHaveBeenCalledWith(oslo);
    expect(input).toHaveValue("");
  });

  // Ensures a late request cannot reopen suggestions after Escape is pressed.
  it("dismisses and invalidates pending suggestions with Escape", async () => {
    let resolveSuggestions!: (locations: Location[]) => void;
    getLocationSuggestionsMock.mockReturnValue(
      new Promise<Location[]>((resolve) => {
        resolveSuggestions = resolve;
      })
    );
    render(<SearchForm onSearch={vi.fn()} />);

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "Oslo" } });
    await finishDebounce();
    fireEvent.keyDown(input, { key: "Escape" });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    await act(async () => {
      resolveSuggestions([oslo]);
      await Promise.resolve();
    });

    expect(screen.queryByRole("option")).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  // Protects against a slower, older response replacing newer suggestions.
  it("ignores stale suggestion responses", async () => {
    let resolveOld!: (locations: Location[]) => void;
    let resolveNew!: (locations: Location[]) => void;
    const bergen = { ...oslo, id: 2, name: "Bergen" };

    getLocationSuggestionsMock
      .mockReturnValueOnce(
        new Promise<Location[]>((resolve) => {
          resolveOld = resolve;
        })
      )
      .mockReturnValueOnce(
        new Promise<Location[]>((resolve) => {
          resolveNew = resolve;
        })
      );

    render(<SearchForm onSearch={vi.fn()} />);
    const input = screen.getByRole("combobox");

    fireEvent.change(input, { target: { value: "Os" } });
    await finishDebounce();
    fireEvent.change(input, { target: { value: "Bergen" } });
    await finishDebounce();

    await act(async () => {
      resolveNew([bergen]);
      await Promise.resolve();
    });
    await act(async () => {
      resolveOld([oslo]);
      await Promise.resolve();
    });

    expect(screen.getByRole("option", { name: /Bergen/i })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Oslo/i })).not.toBeInTheDocument();
  });

  // Confirms manual searches are trimmed before reaching the parent component.
  it("submits a trimmed city name", () => {
    const onSearch = vi.fn();
    render(<SearchForm onSearch={onSearch} />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "  Oslo  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearch).toHaveBeenCalledWith("Oslo");
  });
});
