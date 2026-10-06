export const countries = { in: 'India', us: 'United States', gb: 'United Kingdom' } as const
export const categories = ['general', 'business', 'technology', 'science', 'health', 'sports', 'entertainment'] as const
export type Country = keyof typeof countries
export type Category = (typeof categories)[number]
export type Article = {
  id: string
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string | null
  author: string | null
  source: { id: string | null; name: string }
}
export type Feed = { articles: Article[]; fetchedAt: string | null; providers: string[] }
export type FeedOutcome = {
  country: string; category: string; status: 'updated' | 'retained'
  last_successful_refresh: string | null; articles_count: number | null; providers: string[]
}
export type PipelineStatus = {
  generated_at: string | null; status: string
  newsapi_requests_used: number | null; newsapi_requests_allowed: number | null
  rss_feeds_failed: number | null; api_requests_failed: number | null; feeds: FeedOutcome[]
}

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const text = (value: unknown, limit = 4000): string | null =>
  typeof value === 'string' && value.trim() ? value.trim().slice(0, limit) : null
export function safeUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null
  } catch { return null }
}
export function validDate(value: unknown): string | null {
  return typeof value === 'string' && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null
}
export function parseArticle(value: unknown): Article | null {
  if (!isRecord(value)) return null
  const url = safeUrl(value.url)
  const title = text(value.title, 400)
  if (!url || !title || title === '[Removed]') return null
  const source = isRecord(value.source) ? value.source : {}
  return {
    id: url, url, title, description: text(value.description), author: text(value.author, 200),
    urlToImage: safeUrl(value.urlToImage), publishedAt: validDate(value.publishedAt),
    source: { id: text(source.id, 100), name: text(source.name, 100) || new URL(url).hostname.replace(/^www\./, '') },
  }
}
export function parseFeed(value: unknown): Feed {
  if (!isRecord(value) || !Array.isArray(value.articles) || value.status === 'error') {
    throw new Error('The feed returned an unexpected format.')
  }
  const seen = new Set<string>()
  const articles = value.articles.slice(0, 100).flatMap((item) => {
    const article = parseArticle(item)
    if (!article || seen.has(article.id)) return []
    seen.add(article.id)
    return [article]
  })
  if (value.articles.length && !articles.length) throw new Error('The feed did not contain readable stories.')
  return { articles, fetchedAt: validDate(value.fetched_at), providers: Array.isArray(value.providers) ? value.providers.filter((x): x is string => typeof x === 'string') : [] }
}
export function parseStatus(value: unknown): PipelineStatus {
  if (!isRecord(value)) throw new Error('Feed status is unavailable.')
  const count = (key: string) => typeof value[key] === 'number' && Number.isFinite(value[key]) && value[key] >= 0 ? value[key] as number : null
  const feeds = Array.isArray(value.feeds) ? value.feeds.filter(isRecord).flatMap((item): FeedOutcome[] => {
    if (typeof item.country !== 'string' || typeof item.category !== 'string' || !['updated', 'retained'].includes(String(item.status))) return []
    return [{ country: item.country, category: item.category, status: item.status as FeedOutcome['status'],
      last_successful_refresh: validDate(item.last_successful_refresh),
      articles_count: typeof item.articles_count === 'number' && Number.isSafeInteger(item.articles_count) && item.articles_count >= 0 ? item.articles_count : null,
      providers: Array.isArray(item.providers) ? item.providers.filter((x): x is string => typeof x === 'string') : [] }]
  }) : []
  return { generated_at: validDate(value.generated_at), status: text(value.status, 30) || 'unknown',
    newsapi_requests_used: count('newsapi_requests_used'), newsapi_requests_allowed: count('newsapi_requests_allowed'),
    rss_feeds_failed: count('rss_feeds_failed'), api_requests_failed: count('api_requests_failed'), feeds }
}
const base = (import.meta.env.VITE_NEWS_BASE_URL || 'https://raw.githubusercontent.com/pranav256/news-api/main').replace(/\/$/, '')
export async function loadFeed(country: Country, category: Category, signal: AbortSignal): Promise<Feed> {
  let failure: unknown
  for (const path of [`data/${country}/${category}_headlines.json`, `${country}/${category}.json`]) {
    try {
      const response = await fetch(`${base}/${path}`, { signal })
      if (!response.ok) throw new Error(`Feed request failed (${response.status}).`)
      return parseFeed(await response.json())
    } catch (error) {
      if (signal.aborted) throw error
      failure = error
    }
  }
  throw failure instanceof Error ? failure : new Error('Could not load this feed.')
}
export async function loadStatus(signal: AbortSignal): Promise<PipelineStatus> {
  const response = await fetch(`${base}/data/status.json`, { signal })
  if (!response.ok) throw new Error('Pipeline status could not be loaded.')
  return parseStatus(await response.json())
}
export function filterArticles(articles: Article[], query: string, source: string, order: 'newest' | 'oldest') {
  const needle = query.trim().toLocaleLowerCase()
  return articles.filter((article) => (!source || article.source.name === source) &&
    (!needle || [article.title, article.description, article.author, article.source.name].join(' ').toLocaleLowerCase().includes(needle)))
    .sort((a, b) => ((Date.parse(b.publishedAt || '') || 0) - (Date.parse(a.publishedAt || '') || 0)) * (order === 'newest' ? 1 : -1))
}
