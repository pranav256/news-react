# News Reader

An editorial reader for the sibling `news-api` static feeds, with a bounded
browser-local reading queue and a credential-free fictional demo.

## Run

Requires Node 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open `/` for live headlines or `/demo` for fictional samples. The demo never
requests the live news pipeline; its saved queue is separate from live reading.
Copy `.env.example` to `.env` to select a different static JSON origin.

```sh
npm run check
READER_TEST_SERVER=preview npm run test:e2e
npm run preview
```

The production-preview browser checks use the build produced by `check`, one
worker and isolated Chromium contexts. Install the test binary if needed with
`npx playwright install chromium`. Development mode remains available when
`READER_TEST_SERVER` is unset. Deploy the `dist/` output with an SPA rewrite to
`index.html`, including `/demo` and query-bearing routes.

## Delivered flows

- Country/category selection, literal search, source filters and chronological
  ordering. Filters, queue state and article previews are represented in the URL
  and work with browser Back/Forward.
- Readable stories stay available without images; broken images recover to text.
- Preview the feed's supplied summary, open the complete article at its publisher,
  or share the publisher URL. The demo does not invent full article content.
- Save up to 300 stories, mark read/unread, search the queue, remove stories,
  export JSON and merge validated imports (maximum 2 MB). Duplicates retain the
  existing reading state. Storage errors are visible and export remains available.
- Cancel superseded requests, enforce a 15-second deadline, offer retry, and keep
  last-successful feed data in browser storage or memory when a refresh fails.
- Inspect actual provider names, successful refresh times, API request usage and
  per-feed updated/retained outcomes. Missing metadata is shown as unavailable.

## Data and implementation

`src/lib/feed.ts` validates untrusted feed/status payloads and HTTP(S) links.
Rich `data/{country}/{category}_headlines.json` responses are preferred; the
original `{country}/{category}.json` paths remain a compatibility fallback.
Neither article publication dates nor the browser clock are substituted for a
pipeline refresh timestamp. The sibling pipeline must be deployed before its
new per-feed metadata appears in the live reader.

`src/lib/library.ts` owns preference, saved-queue and cache validation.
`src/hooks/useFeed.ts` owns cancellation, timeout, cache and race protection.
The library uses `news-reader:library:v1` (live) and a separate `:demo` suffix.
There is no account, cloud storage or cross-device synchronization.

The selected Romanesque-based Better Design system provides cream/Bordeaux
tokens, serif editorial headings, Inter controls, composed Sidebar/Dialog/Table
primitives and owned Iconoir SVG components. The app typechecks its entrypoint,
domain modules and tests, recursively including imported primitives. Unused
registry gallery examples are not application entrypoints; some gallery examples
use package APIs that differ from the installed versions and are not represented
as verified features.

## Verification evidence

- **14 unit tests passed**: parsing, literal search, hostile/invalid imports,
  preferences, stable demo identity, URL round trips, storage failure, last-success
  recovery, request races and demo isolation.
- **7 browser tests passed**; one duplicate mobile capture test is intentionally
  skipped because the desktop capture test covers all three widths. Desktop and
  mobile discovery/preview/save/reload/read/filter/import and keyboard paths pass.
- Production build and application typecheck passed.
- Real Inter loading, no horizontal overflow, and screenshots were checked at
  390, 1440 and 1728 pixels, including light/dark and focused filter dialogs.
- Better Design comprehension passed. Measured spacing returned no findings after
  correcting the dialog's hidden-label false positive and layout defects.

Evidence is in `test-results/` after the browser run and is uploaded by CI.
Detailed boundaries are in `.better-design/review.md`.
Live feed ingestion, external publisher availability and public deployment are
not exercised by fixture tests.
