# 24x7

A text-led news reader for [the public news-api feeds](https://github.com/pranav256/news-api). Read the live edition, open publisher reports, and keep a reading list in this browser.

[Live reader](https://24x7.vercel.app) | [API playground](https://news-api-live.vercel.app)

## Development

Node.js 22.12 or later and npm are required.

```sh
npm ci
npm run dev
```

## Verification

```sh
npm run check
npx playwright install chromium
npm run test:e2e
```

For browser checks against the production build, set READER_TEST_SERVER to preview before running test:e2e. PowerShell: `$env:READER_TEST_SERVER = 'preview'`.

## Reading

- Select India, the United States or the United Kingdom, and one of seven sections.
- Search headlines and publishers, filter by source, and choose chronological order.
- Read the supplied summaries and open complete reports at their publishers.
- Save up to 300 stories, track read/unread state, and export or import a reading-list backup of up to 2 MB.
- Share publisher links. Existing duplicates keep their reading state when imported.
- Filters and article previews are reflected in the URL and support browser Back/Forward.
- Theme and saved stories are stored locally. Storage failures are visible.

## Data

The live route fetches public JSON directly from raw.githubusercontent.com. Rich files at data/{country}/{category}_headlines.json are preferred, with the original {country}/{category}.json contract as a fallback. There is no proxy, API key or persistent application backend.

Requests cancel when the selection changes, time out after 15 seconds, refresh every two minutes while visible, and retry when connectivity returns. A failed refresh retains the last successful edition from browser storage or memory. Missing publication metadata stays unavailable.

The separate /demo route uses explicitly labeled local fixtures and makes no requests to the live pipeline. Its preferences and saved stories use separate storage keys.

## Structure

- src/App.tsx: app shell, URL state and reading actions.
- src/components: headline layouts, previews, saved reading and edition controls.
- src/components/ui: composed design primitives, including Sidebar and Table.
- src/components/icons: the selected Iconoir SVG family.
- src/lib: feed validation, local storage, demo fixtures and navigation.
- src/hooks/useFeed.ts: feed lifecycle and recovery.
- tests/e2e: isolated browser checks and rendered spacing evidence.

The Romanesque-based editorial system uses locally bundled Newsreader, Inter and JetBrains Mono fonts. See DESIGN.md for its layout and interaction rules.

## Deployment

Vercel builds main with npm run build and serves dist/ with an SPA rewrite. No environment variables are required. The canonical reader is https://24x7.vercel.app.

Article text and photography belong to the original publishers. Publisher access restrictions may apply.
