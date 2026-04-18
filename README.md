# Lendsqr Frontend Assessment

This is a React, TypeScript, SCSS, and Cloudflare-ready implementation of the Lendsqr user dashboard assessment. The app covers the login flow, user listing, table-heavy dashboard interactions, mock API-backed pagination/filtering, and a user detail page with persisted status changes.

The implementation is intentionally structured like a small production front end rather than a throwaway mock. Data boundaries are typed, UI primitives are reusable, styles are colocated with their components, and page code composes those pieces without hiding behavior in loose utility logic.

## Stack

- React 19 with `react-router-dom` for routing.
- TypeScript with strict model types in `src/types`.
- Vite with `@cloudflare/vite-plugin` for the app runtime and Worker API route.
- SCSS as the styling system, with one global composition entrypoint at `src/styles/main.scss`.
- TanStack Query for server state.
- TanStack Table for the users table.
- TanStack Form plus Zod for login form validation.
- Zustand with localStorage persistence for user detail state.
- Bun for package management and scripts.

## Running The App

```bash
bun install
bun run dev
```

Useful scripts:

```bash
bun run build
bun run lint
bun run preview
bun run deploy
```

The Vite dev server serves the React app and the Cloudflare Worker route together. API requests under `/api/*` run through the Worker entrypoint, while the rest of the app is handled as a single page application.

## Product Surface

The app has three main route groups:

- `/` and `/login` render the login experience.
- `/users` renders the dashboard users page.
- `/users/:id` renders the user detail page.

The login page is intentionally separate from the dashboard shell. The authenticated user pages share the top navigation and sidebar through `UsersLayout`, while the login screen keeps its split-panel layout, Avenir Next typography, and isolated background treatment.

## Architecture

The project is organized around clear ownership boundaries:

```text
src/
  api/          typed frontend API clients and reusable request handlers
  assets/       reusable SVG icon components
  components/   shared UI primitives and dashboard chrome
  constants/    app constants and fixture source values
  pages/        route-level screens and page-specific components
  store/        local persisted user state
  styles/       global SCSS composition, base rules, and fonts
  types/        strict shared TypeScript types
  utils/        deterministic fixtures, filters, dates, validation helpers
worker/         Cloudflare Worker entrypoint for API routes
```

Each reusable UI component owns its folder, component file, optional `index.ts`, and matching SCSS file. Page-specific components stay inside their page folder, for example the users table columns and detail sections live under `src/pages/users/components`.

The path alias `@/*` maps to `src/*` in both Vite and TypeScript-facing imports, so the app avoids brittle deep relative import paths.

## API And Data Flow

The mock API is not generated inside the UI. It is materialized once in `src/api/users/mock-store.ts` from deterministic fixture utilities and exposed through the Worker route in `worker/index.ts`.

The users endpoint supports:

- `GET /api/users?limit=20`
- `GET /api/users?limit=20&cursor=40`
- `GET /api/users/:id`
- Table filters such as `organization`, `username`, `email`, `phoneNumber`, `dateJoined`, and `status`

Filtering happens before pagination on the API side. That matters because filtering only the currently fetched page can report an empty table even when a matching record exists on a later page. The frontend sends the active filters in the React Query request key and resets back to page one whenever a filter changes.

The table total and stats total are intentionally separate. Table pagination uses the filtered API total, while dashboard stat cards use an unfiltered stats request so summary metrics do not change when the table is filtered.

## Typing Pattern

Types live in `src/types` and are exported through a barrel. The user model uses discriminated constant objects and literal unions where they improve correctness:

- `UserStatus` is a constant object plus inferred union.
- `UserId`, `EmailAddress`, `NigerianPhoneNumber`, and `IsoDateTime` are template literal types.
- `PaginatedRequest` carries typed cursor, limit, and optional `UserFilters`.
- `UserDetails` extends the list-level `User` with the richer detail-page fields.

The API boundary is kept strict through these types rather than broad parsing or normalization layers. Zod is used only where it earns its place: login form validation at the user-input boundary.

## UI Pattern

The component layer is built from small primitives:

- `Button` handles variants, tones, loading state, icon placement, full-width behavior, and the global outline button style.
- `Input` handles labels, errors, and password visibility.
- `Card`, `Badge`, `Avatar`, `SearchInput`, `Pagination`, and `PageSizeDropdown` provide reusable dashboard pieces.
- `DataTable` wraps TanStack Table and keeps table rendering generic.
- `TopNav`, `Sidebar`, `NavItem`, `NavItemGroup`, and `NavItemDropdown` form the dashboard shell.

The users table columns are created with `createUserColumns`, so navigation and filter behavior are injected from the page instead of being hard-coded into static column definitions. Row navigation is intentionally handled by the `View Details` action menu, not by clicking the whole row.

## Styling Direction

SCSS is a hard requirement in this project, so the app uses Vite's normal SCSS pipeline instead of runtime style compilation. `src/styles/main.scss` composes base styles, fonts, components, and pages through `@use`.

Design tokens that are reused globally live in `:root`, including the primary color, neutral color, success color, and input border colors. Component SCSS files keep the design details near the markup they style.

Local fonts are registered in `src/styles/_fonts.scss`:

- Work Sans is the base dashboard font.
- Roboto is used where the design calls for it, such as the top-nav docs link.
- Avenir Next is used for the login page.
- SF Compact Text is available for detail-page design parity.

The layout decisions follow the assessment screens closely: the dashboard top nav reserves sidebar space on desktop, the sidebar is fixed-width at desktop sizes, dashboard cards flex with a fixed gap, and mobile screens use a slide-out sidebar trigger.

## Users Page

The users page composes:

- Four stat cards derived from the full mock dataset.
- A TanStack Table-backed data card.
- Server-backed pagination and page-size selection.
- Per-column filter popovers.
- Status badges with the assessment variants.
- Row actions for viewing details, blacklisting, and activating users.

Filters are portaled outside the table so they do not shift the header layout or remount focused inputs. Date filtering uses the native date picker while hiding the browser placeholder until a date is selected.

## User Detail Page

The detail page fetches a single user by id and stores the returned user in localStorage through Zustand. Manual status actions are also persisted as overrides, so the detail page and table can resolve the latest local status without mutating the mock API data.

The detail screen is split into summary, tabs, and the general details section. The richer user detail shape includes personal information, education and employment, socials, guarantors, bank information, account balance, and tier.

## Design Decisions

- Vite plus the Cloudflare plugin was chosen over a custom Bun server because it keeps SCSS, HMR, React, and Worker-compatible API routes in one supported path.
- The Worker handler reuses the same typed user request handler used by local development, so deployment does not require a separate API implementation.
- Mock data is deterministic and module-scoped, which keeps pagination, filtering, and detail lookups stable across requests.
- User filters are API-level concerns, not table-only concerns.
- The stats query is intentionally independent from table filters.
- Component styles are colocated and imported once through the SCSS composition entrypoint.
- Shared models, constants, and utilities are kept out of pages so page files read as composition code.

## Verification

Before handing off changes, run:

```bash
bun run build
bun run lint
```

The build performs TypeScript checking with `tsc --noEmit` before producing the Vite build. Lint currently includes the configured React Hooks and React Refresh checks.
