# Cloudy Weather App

[![CI](https://github.com/nataliaberaki/WeatherApp/actions/workflows/ci.yml/badge.svg)](https://github.com/nataliaberaki/WeatherApp/actions/workflows/ci.yml)

Cloudy is a responsive weather application built with React, TypeScript, and Vite. Search for a city or use a quick-search shortcut to view its current temperature, weather condition, wind speed, and humidity.

## Features

- Search for cities worldwide
- Debounced location suggestions
- Keyboard-accessible autocomplete navigation
- Current temperature, wind speed, and humidity
- Weather descriptions and icons based on WMO weather codes
- Background themes that change with the current conditions
- Quick-search shortcuts for popular cities
- Loading, empty, and error states
- Cancellation of outdated API requests
- Runtime validation of API responses
- Responsive layouts for phones, tablets, and desktops
- Reduced-motion and screen-reader support

## Built with

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Open-Meteo](https://open-meteo.com/)

## Getting started

### Requirements

- Node.js 20.19 or newer
- npm

### Installation

```bash
git clone https://github.com/nataliaberaki/WeatherApp.git
cd WeatherApp
npm ci
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed in the terminal, normally `http://localhost:5173`.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check the code with ESLint |
| `npm test` | Run all automated tests once |
| `npm run test:watch` | Run tests continuously while files change |

## Testing

The automated tests cover:

- Weather-code mappings and fallback behavior
- Successful and malformed weather API responses
- HTTP service failures
- Wind-speed unit configuration
- Weather-card rendering
- Close-button interaction
- Autocomplete debounce and minimum input length
- Stale autocomplete response protection
- Keyboard suggestion selection and Escape cancellation
- App loading, success, and error states
- Returning from weather results to the welcome screen

Run the complete test suite with:

```bash
npm test
```

Before merging changes, run:

```bash
npm run lint
npm test
npm run build
```

GitHub Actions runs the same lint, test, and build checks automatically for every pull request into `main` and every push to `main`.

## Project structure

```text
src/
├── components/   React components and component tests
├── services/     Open-Meteo requests, validation, and API tests
├── styles/       Global and responsive styles
├── test/         Shared test setup
├── types/        Shared TypeScript types
├── utils/        Weather-code mappings and utility tests
├── App.tsx       Application state and search flow
└── main.tsx      React entry point
```

The repository also includes `.github/workflows/ci.yml`, which defines the automated quality checks used on GitHub.

## API

Cloudy uses the free [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) for location suggestions and the [Open-Meteo Forecast API](https://open-meteo.com/en/docs) for current weather data. No API key is required.

Weather conditions are interpreted using the WMO weather codes documented by Open-Meteo. Wind speed is requested in metres per second.

## Accessibility

The search interface includes combobox and listbox semantics, keyboard navigation, visible focus styles, live loading announcements, and screen-reader labels. The layout also respects the user's reduced-motion preference.

## License

This project is available under the [MIT License](LICENSE).

## Author

Created by [Natalia Beraki](https://github.com/nataliaberaki).
