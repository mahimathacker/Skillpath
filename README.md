# Skillpath

Skillpath is a landing page built in Framer for a fictional learning platform. The Hero and Footer are built visually in Framer, while the Courses section is a React Code Component that loads live API data.

## Courses component

`CoursesSection.tsx`:

- Fetches courses and country data concurrently with `Promise.allSettled()`.
- Checks HTTP errors and validates the runtime response fields used by the component.
- Handles loading, course error, empty results, and successful results.
- Keeps valid courses visible when country detection fails and displays `Pricing unavailable` instead of guessing a currency.
- Converts paise to rupees and cents to dollars before formatting with `Intl.NumberFormat`.
- Displays three columns on desktop, two on tablet, and one on mobile.
- Supports variable course counts and automatically sizes its Framer layer to the rendered content.

## Pricing behavior

| Country result | Displayed value |
| --- | --- |
| `IN` | `pricePaise / 100`, formatted as INR |
| `US` | `priceUsdCents / 100`, formatted as USD |
| Country request fails | `Pricing unavailable` |

If the course request fails, the component shows a controlled section-level error. It never displays raw API errors to visitors.

## Framer Property Controls

The component provides exactly two controls:

- **Heading** changes the courses-section heading.
- **Accent** changes category text, price text, and the loading-spinner accent.

## Local type checking

The component runs inside Framer. This repository also includes a minimal local TypeScript setup so the source can be checked in VS Code or any other IDE.

Install dependencies:

```bash
npm install
```

Run the type checker:

```bash
npm run typecheck
```

## Project structure

```text
CoursesSection.tsx  Framer React Code Component
package.json        Local type-checking dependencies and script
tsconfig.json       TypeScript configuration
```

The component intentionally remains in one file. Its types, validation, requests, state handling, rendering, Property Controls, and styles belong to one focused feature and are easier to review and modify together.
