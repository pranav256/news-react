# 24x7 design

Keep the selected Romanesque-based editorial system and Iconoir icons. Use the warm paper and dark slate tokens in src/index.css; keep Newsreader headings, Inter controls and JetBrains Mono figures loaded locally.

The reading app starts with its edition controls and headlines. The lead story pairs its headline, publisher metadata, summary and actions with its photograph. Supporting stories sit in a divided column, with the latest reports below. At narrow widths, stack the lead photograph after its copy. Avoid promotional sections before the stories.

Compose Sidebar for desktop section navigation, Table for saved reading, and the installed Dialog for filters and article previews. At narrow widths, show section controls in the main flow and stack saved records without horizontal page scrolling.

Use one restrained accent, hairline dividers, consistent spacing and targets of at least 44 pixels. Keep hover effects inside fine-pointer media queries and preserve active states. Respect reduced-motion preferences.

Show actual publisher metadata. Missing data stays unavailable. The demo must remain visibly labeled and isolated from live requests and saved reading.

Verify changes with npm run check and npm run test:e2e. Capture desktop and mobile views, including dark mode, dialogs, saved reading, loading and failure states. Better Design review calls are required; report tool availability limits honestly.
