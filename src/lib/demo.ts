import { parseFeed, type Country, type Category } from './feed'

// Explicitly fictional samples: demo mode never requests the live pipeline.
const stories = [
  ['A community garden makes room for a new season', 'Residents plan shared growing spaces and a weekend seed exchange.', 'general'],
  ['Small businesses test a shared delivery service', 'Independent shops compare a cooperative approach to local deliveries.', 'business'],
  ['A public library opens its digital workshop', 'A new program introduces practical technology skills through community projects.', 'technology'],
  ['Researchers map the night sky with volunteers', 'A sample story about citizen science and careful observation.', 'science'],
  ['A walking group connects neighbors each morning', 'Community members build a routine around accessible outdoor activity.', 'health'],
  ['The local team prepares for its opening match', 'Coaches discuss preparation and a new season of community sport.', 'sports'],
  ['An independent cinema hosts a weekend retrospective', 'A sample program brings classic films and discussion to a neighborhood screen.', 'entertainment'],
  ['A quiet riverside route returns to public use', 'Volunteers help reopen a familiar walking route after scheduled maintenance.', 'general'],
] as const
export function demoFeed(country: Country, category: Category) {
  const selected = stories.map((story, index) => ({ story, index })).filter(({ story }) => category === 'general' || story[2] === category)
  return parseFeed({ fetched_at: '2026-10-05T06:00:00Z', providers: ['demo fixtures'], articles: selected.map(({ story: [title, description], index }) => ({
    title, description, url: `https://example.com/${country}/sample-story-${index}`, urlToImage: null,
    source: { id: 'sample-news', name: index % 2 ? 'Community Journal (sample)' : 'Daily Reader (sample)' },
    author: 'Demo newsroom', publishedAt: `2026-10-05T0${6 - index % 5}:00:00Z`,
  })) })
}
